[Learning Rate Transfer in Normalized Transformers](https://arxiv.org/abs/2604.27077)

Boris Shigida (Princeton University; Meta Superintelligence Labs intern), Boris Hanin (Princeton University), Andrey Gromov (Meta Superintelligence Labs)

> The Normalized Transformer, or nGPT (arXiv:2410.01131) achieves impressive training speedups and does not require weight decay or learning rate warmup. However, despite having hyperparameters that explicitly scale with model size, we observe that nGPT does not exhibit learning rate transfer across model dimension and token horizon. To rectify this, we combine numerical experiments with a principled use of alignment exponents (arXiv:2407.05872) to revisit and modify the μP approach to hyperparameter transfer (arXiv:2011.14522). The result is a novel nGPT parameterization we call νGPT. Through extensive empirical validation, we find νGPT exhibits learning rate transfer across width, depth, and token horizon.

## 비유로 풀어보기

### 풀려는 문제 (Problem)

nGPT는 "재료 양만 비율대로 맞춰주면 4인분이든 40인분이든 같은 불 세기·같은 시간으로 완성된다"고 약속한 레시피카드다. weight를 매 스텝마다 hypersphere로 정규화하기 때문에 weight decay도 learning rate warmup도 필요 없고, 모델 폭(width)과 깊이(depth)에 따라 명시적으로 scaling되는 hyperparameter가 카드 위에 적혀 있다. 그런데 실제로 0.26B 솥에서 3.22B 솥으로 키워보면(8 heads → 40 heads), 불 세기(global learning rate)를 매번 다시 잡아줘야 최적 학습이 된다. 토큰 수가 늘어도, 깊이(8 → 128 layers, 0.39B → 2.55B parameters)가 늘어도 같은 증상이다.

문제의 뿌리는 이 레시피카드가 의지하던 μP라는 "재료끼리 어떻게 정렬되는지(weight–activation alignment exponent)에 대한 표준 가정"이 정규화된 솥 위에서는 맞지 않는다는 점이다. μP는 weight와 activation의 정렬이 width를 따라 완전 정렬(exponent 1) 또는 무정렬(exponent 0)이라고 가정하지만, nGPT는 그 중간 — 약 3/4 — 에서 정렬된다. 레시피카드는 맞는 비율을 약속했는데, 정작 솥 안에서 재료들이 섞이는 양상은 카드의 가정과 어긋나 있었다.

### 어떻게 푸는가 (Method)

저자들은 책상에 앉아 새 공식을 쓰는 대신, 학습 중간에 진짜로 맛을 본다. 학습이 진행되는 동안 hidden layer와 output layer의 weight–activation alignment exponent를 직접 측정해보니 ω_hidden = ω_output = 1/2로 일관되게 나왔다(μP가 가정한 1이 아니다). loss로 가중평균한 정렬 정도는 약 3/4 근처에 모인다 — 이른바 "mid alignment"다.

이 측정값에 맞춰 6개 재료의 scaling 곡선을 다시 그린다. (1) 불 전체 세기(global learning rate)는 토큰 수의 -1/3 제곱으로 줄인다. (2) embedding 학습률 η_input은 m_width^(-1/2)로 줄인다 — 입력 재료는 여전히 μP 곡선 그대로. (3) hidden과 unembedding 학습률 η_hidden, η_output은 m_width^(-3/4)로 줄인다 — μP의 -1/2 대신 측정된 alignment를 반영한 새 곡선. (4) 잔차 scale α_{A,init}, α_{M,init}는 0.05 · m_depth^(-1)로 초기화한다. (5) α scale 자체는 d_model^(-1/2)로 떨어뜨리지 않고 0.03 상수로 고정한다. (6) unembedding 초기화는 s_{z,init} = m_width^(1/2)로 잡는다.

레시피카드의 비율표를 재료별로 서로 다른 power law로 다시 적은 셈이다. 결과물이 νGPT다. 단, 비판적으로 따져보면 정렬 지수는 학습 초기에는 흔들리고 후기(late training)에 0.5–0.6 범위로 안정되기 때문에, 학습 가능한 α_A, α_M 파라미터가 "자기 보정 튀김 온도계"처럼 측정과 이론 사이의 미스매치를 흡수하고 있을 가능성도 있다.

### 무엇을 얻었나 (Result)

같은 한 장의 레시피카드로 0.26B 솥과 3.22B 솥(8 heads → 40 heads)에서 같은 최적 learning rate를 쓰는 게 가능해졌다 — Figure 2에서 nGPT는 최적 LR이 폭을 따라 흘러가지만, νGPT는 "essentially perfect transfer with no loss of performance"를 보인다. 깊이 방향(8 → 128 layers, 0.39B → 2.55B parameters)에서는 nGPT도 이미 어느 정도 transfer되던 것이, νGPT에서 약간 더 안정된다.

토큰 호라이즌에서는 최적 learning rate가 (iteration count)^(-1/3) power law를 따른다는 것을 확인했고, 이는 Bjorck et al. (2025)이 비정규화 transformer에서 측정한 결과와 일치한다. 학습 설정은 FineWeb-Edu, sequence length 4096, batch size 64, 80,000 steps (~21B tokens), OLMo 2 tokenizer(vocabulary 100,352), Adam(β₁=0.9, β₂=0.95). 세 개의 initialization seed에 걸쳐 validation loss를 측정했고, 최종 손실은 두 모델이 비등하거나 νGPT가 살짝 더 낮다("no worse or slightly better").

### 비유가 깨지는 지점 (Limit)

레시피 비유는 몇 군데에서 들킨다. 첫째, 진짜 주방은 보존제(weight decay)를 쓴다. 이 논문은 weight decay 없이만 검증했고, 저자들도 "dynamic understanding of weight decay when it is, in fact, used"가 미해결이라고 명시한다. 실제 production training에서 weight decay와 함께 쓸 경우 alignment exponent 자체가 바뀔 수 있다.

둘째, 핵심 토큰 scaling 지수 1/3은 측정값이지 도출값이 아니다. 저자들도 "the ∼1/3 exponent in the token count corrections" lacks analytical prediction이라고 적는다. 레시피 비유에서는 "재료별로 정해진 power law가 있다"고 말하지만, 정작 그 power law의 이론적 근거 한 축은 비어 있다.

셋째, 학습 가능한 α_A, α_M 파라미터가 자기 보정 도구처럼 작동해 이론과 실제 사이의 미스매치를 흡수할 가능성이 있다. 이 경우 transfer가 잘 되는 진짜 이유가 reparameterization 때문인지, 학습 가능한 α의 흡수 효과 때문인지 분리되지 않는다 — 저자들도 "complete understanding of depthwise transfer in normalized models" requires further work이라고 인정한다.

넷째, 실험 규모는 0.26B–3.22B parameters와 ~21B tokens로 2026년 frontier 학습 기준으로는 modest다. 비유 속 가정용 솥에서는 잘 맞아도, 1T tokens 규모의 industrial scale에서 같은 -1/3, -3/4 지수가 유지될지는 이 논문이 보장하지 않는다.

마지막으로, nGPT 자체가 표준 production architecture는 아니다. 비유는 "정규화된 솥"이라는 특수한 조리 도구를 가정하고 출발하기 때문에, RMSNorm + post-norm 같은 다른 normalization 변종으로 그대로 옮겨가지는 않을 수 있다.
