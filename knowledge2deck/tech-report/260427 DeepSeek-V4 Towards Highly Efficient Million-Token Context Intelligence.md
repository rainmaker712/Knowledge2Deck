[DeepSeek-V4: Towards Highly Efficient Million-Token Context Intelligence](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)

DeepSeek-AI

> 1.6T 총 파라미터(49B activated)의 DeepSeek-V4-Pro와 284B(13B activated)의 V4-Flash 두 MoE 모델을 발표한 preview tech report. 1M 토큰 네이티브 context를 핵심 목표로 삼아 (i) **하이브리드 압축 어텐션(CSA + HCA)**, (ii) **Manifold-Constrained Hyper-Connections (mHC)**, (iii) trillion-scale **Muon optimizer**, (iv) Mixed RL을 대체하는 **On-Policy Distillation (OPD)** 네 축을 도입한다. 1M context에서 V3.2 대비 단일-토큰 inference FLOPs 27%, KV cache 10%로 줄였고, V4-Pro-Max는 open model SOTA를 갱신하며 frontier closed model에 3~6개월 격차로 따라붙었다.

<!-- Panel Verdict: PROCEED — R5 명백 통과(DeepSeek 모델 릴리스 = 사전학습+포스트학습+에이전트 핵심 토픽). R4 우려는 본문 한계 절에 명시. -->

## Key Contributions

- **Hybrid CSA + HCA Attention (1M context의 핵심)**: 두 종류의 압축 어텐션을 layer 단위로 인터리빙. **CSA(Compressed Sparse Attention)** = m=4 토큰을 1 entry로 압축 후 lightning indexer로 top-k(=512 또는 1024) 압축 entry만 sparse하게 attend. **HCA(Heavily Compressed Attention)** = m'=128 토큰을 1 entry로 강압축한 뒤 dense attention. 두 변형 모두 query head 64-128개로 MQA 스타일, sliding window(n_win=128) branch + RoPE 부분 적용 + attention sink 결합. 1M-token 환경에서 V3.2 대비 inference FLOPs 27%, KV cache 10%, BF16 GQA8 baseline 대비 KV cache 약 2%까지 감축.
- **Manifold-Constrained Hyper-Connections (mHC)**: 기존 Hyper-Connection이 multi-layer stack에서 numerical instability를 일으키는 문제를 해결하기 위해 residual mapping 행렬 B_l을 **doubly stochastic matrices 매니폴드(Birkhoff polytope)** 로 Sinkhorn-Knopp(20 iter)로 projection. spectral norm ‖B_l‖_2 ≤ 1을 보장해 forward/backward 모두 non-expansive. 입력/출력 매핑 A_l, C_l은 sigmoid로 non-negative bounded 처리. 깊은 residual stream(n_hc=4 expansion)에서 안정적 학습 가능하게 함.
- **Trillion-scale Muon Optimizer**: 대부분 모듈에 Muon 적용(embedding/prediction head/RMSNorm/mHC 정적 bias만 AdamW). **Hybrid Newton-Schulz**: 10 iteration 2단계 (앞 8 step (a,b,c)=(3.4445, -4.7750, 2.0315)로 빠른 수렴, 뒤 2 step (2, -1.5, 0.5)로 singular value 1로 stabilize). RMS rescaling으로 AdamW 학습률 재활용. RMSNorm 덕에 logit explosion이 안 생겨 QK-Clip 불필요.
- **On-Policy Distillation으로 Mixed RL 완전 대체**: V3.2의 mixed RL stage를 폐기하고 두 단계로 재구성: (1) 도메인별 specialist (math/code/agent/instruction) 를 SFT + GRPO로 학습, (2) **multi-teacher OPD**로 student π_θ에서 sampling한 trajectory에 대해 reverse KL D_KL(π_θ ‖ π_{E_i})를 sum-of-experts loss로 최소화. **Full-vocabulary** logit distillation을 위해 teacher 마지막 hidden state만 중앙 buffer에 cache하고 prediction head를 on-the-fly 호출. 10+ teacher 사용. **Generative Reward Model**도 RL로 직접 최적화해 actor가 자체 평가 기능까지 통합.
- **1M context infrastructure**: KV cache on-disk storage + shared-prefix reuse(에이전트 multi-turn에 핵심), SWA KV에 대한 세 가지 caching 전략(Full/Periodic/Zero), token-granular WAL 기반 preemptible/fault-tolerant rollout (regenerating from scratch가 length bias를 만든다는 분석 포함), context-parallelism 2-stage, **DSec(DeepSeek Elastic Compute) sandbox** — Function/Container/microVM/fullVM 4-way 통합 SDK로 수십만 동시 sandbox 운영.
- **FP4 + FP8 Mixed Precision QAT**: MoE expert weights와 lightning indexer QK path는 native FP4 (MXFP4), 나머지는 FP8. Training 시 FP4 weight를 lossless FP4→FP8 dequant로 simulate해 FP32 master weight + 기존 FP8 backward 재활용. 미래 hardware에서 FP4×FP8 GEMM이 1/3 더 효율 가능.
- **MoE 학습 안정화 트릭 — Anticipatory Routing + SwiGLU Clamping**: loss spike의 원인이 routing-induced outlier 누적임을 발견. (i) routing index를 시점 t-Δt의 historical params θ_{t-Δt}로 미리 계산해 routing/backbone의 동기 update가 만드는 vicious cycle을 끊고 (loss spike 시에만 자동 활성화로 wall-clock overhead ~20%로 한정), (ii) SwiGLU linear는 [-10, 10] clamp, gate는 ≤10 cap. 이 두 트릭으로 1.6T MoE 학습이 rollback 없이 진행.

## Method / Architecture

### 모델 구성
- **V4-Pro**: 61 transformer layers, hidden d=7168, 384 routed experts (token당 6 활성) + 1 shared expert, expert hidden 3072, MoE 첫 3 layer만 hash routing. 1.6T 총 / 49B 활성 파라미터, 33T tokens 학습.
- **V4-Flash**: 43 layers, d=4096, 256 routed experts (6 활성), expert hidden 2048. 284B 총 / 13B 활성, 32T tokens.
- **공통**: 첫 2 layer는 sliding-window only, 이후 CSA / HCA 인터리브. CSA는 m=4 압축 + top-k=512(Flash)/1024(Pro), HCA는 m'=128 압축. n_h=64(Flash)/128(Pro) query heads, head dim c=512. mHC expansion n_hc=4. Multi-Token Prediction depth=1 (V3 그대로). DeepSeekMoE auxiliary-loss-free balancing + sigmoid→sqrt(softplus) affinity로 변경, routing target 노드 제한 제거.

### Mesa(인접 deck 비교) 대비 위치
- 본 논문은 Mesa-style architectural test-time compute가 아니라 **attention의 압축**으로 1M context 효율을 달성. RNN화가 아닌 transformer 골격 + sparse/heavy 압축의 조합이라는 점에서, 같은 "test-time compute paradigm"이라는 어휘를 다른 차원에서 사용한다.

### Pre-training Setup
- 32T+ tokens, mid-training에 agentic data 본격 추가. Web data에서 batched/template content 필터링(model collapse 방지). 학술/논문 corpora 비중 강화.
- Sequence schedule: 4K → 16K → 64K → 1M 단계적 확장. Sparse attention은 1T tokens 이후 64K부터 도입.
- Sample-level attention masking 도입(V3와 차별화), V3 tokenizer 128K + special tokens 추가, Fill-in-Middle 유지.
- Batch 75.5M(Flash) / 94.4M(Pro) tokens, peak LR 2.7e-4(Flash) / 2.0e-4(Pro), MTP loss weight 0.3 → 0.1 cosine decay 시점 변경.

### Post-training Pipeline
1. **Specialist training**: 각 도메인별 SFT → GRPO. 세 reasoning effort mode (Non-think / Think High / Think Max) 별로 다른 length penalty + context window로 동일 모델을 다중 학습. Think Max는 system prompt에 "Reasoning Effort: Absolute maximum…" injection.
2. **OPD merging**: 10+ teacher → 1 student, full-vocab KL. **Generative Reward Model**을 actor와 통합 학습(RLHF 대체).
3. **Tool-call schema**: `<|DSML|tool_calls>` XML 기반 — 기존 JSON 기반보다 escaping/parse error 감소. `<think>...</think>` reasoning 토큰. **Interleaved thinking** for tool-call multi-turn (V3.2에서는 user message마다 reasoning trace 폐기 → V4는 tool-call 시퀀스 동안 reasoning 누적 유지).
4. **Quick Instruction**: `<|action|>`, `<|query|>`, `<|authority|>`, `<|domain|>`, `<|extracted_url|>` 등 special token으로 보조 task를 main forward와 KV cache 공유로 처리해 별도 small model 호출 제거 → TTFT 단축.

## Results

### Base 모델 비교 (Table 1, V3.2-Base 671B/37B → V4-Flash-Base 284B/13B → V4-Pro-Base 1.6T/49B)
| 카테고리 | V3.2-Base | V4-Flash-Base | V4-Pro-Base |
|---|---|---|---|
| MMLU | 87.8 | 88.7 | **90.1** |
| MMLU-Pro | 65.5 | 68.3 | **73.5** |
| FACTS Parametric | 27.1 | 33.9 | **62.6** |
| TriviaQA | 83.3 | 82.8 | **85.6** |
| GSM8K | 91.1 | 90.8 | **92.6** |
| MATH | 60.5 | 57.4 | **64.5** |
| LongBench-V2 | 40.2 | 44.7 | **51.5** |

핵심: V4-Flash-Base가 V3.2-Base보다 **활성 파라미터 1/3, 총 파라미터 < 절반**으로 대부분 벤치마크에서 우위 — 압축 어텐션 + 데이터/학습 개선의 합산 효과.

### V4-Pro-Max vs Frontier (Table 6)
| 벤치마크 | DS-V4-Pro-Max | Opus-4.6 Max | GPT-5.4 xHigh | Gemini-3.1-Pro High |
|---|---|---|---|---|
| MMLU-Pro | 87.5 | 89.1 | 87.5 | **91.0** |
| SimpleQA-Verified | 57.9 | 46.2 | 45.3 | **75.6** |
| GPQA Diamond | 90.1 | 91.3 | **93.0** | 88.6 (94.3 표 중 최고) |
| LiveCodeBench | **93.5** | 88.8 | — | 91.7 |
| Codeforces Rating | **3206** | — | 3168 | 3052 |
| HLE Pass@1 | 37.7 | 40.0 | 39.8 | **44.4** |
| MRCR 1M | 83.5 | **92.9** | — | 76.3 |
| SWE Verified | 80.6 | **80.8** | — | 80.6 |
| Terminal Bench 2.0 | 67.9 | 65.4 | **75.1** | 68.5 |
| BrowseComp | 83.4 | **83.7** | 82.7 | **85.9** |

**3-6개월 격차** 자체-진단: GPT-5.4 / Gemini-3.1-Pro에 비해 reasoning에서 marginal 뒤처짐. SimpleQA-Verified에서 open-source baseline(K2.6, GLM-5.1) 대비 +20pp 우위, Gemini-3.1-Pro에는 -18pp. **Codeforces 3206**으로 open model 최초 GPT-5.4 매칭.

### Reasoning Mode 효과 (Table 7, V4-Pro)
- HLE: Non-Think 7.7 → High 34.5 → Max 37.7
- LiveCodeBench: 56.8 → 89.8 → 93.5
- HMMT 2026 Feb: 31.7 → 94.0 → 95.2
- Apex: 0.4 → 27.4 → 38.3
- **Putnam-2025 frontier (formal+informal hybrid)**: 120/120 (Aristotle 100, Seed-1.5-Prover 110, Axiom 120 동률)

### Long-context (MRCR 8-needle, Figure 9)
- V4-Pro-Max: 8K 0.90 → 32K 0.94 → 128K 0.90 → 512K 0.66 → 1024K **0.59**
- V4-Flash-Max: 8K 0.91 → 1024K 0.49
- **128K까지는 견고**, 그 이후 점진적 degradation. CorpusQA 1M 62.0% (Gemini-3.1-Pro 53.8 대비 우위).

## Takeaways

- **압축 어텐션 두 변형의 인터리빙**(CSA sparse + HCA dense)은 단일 어텐션 mechanism 변경보다 **1M context에서 cost-quality trade-off가 현격히 우수**하다는 실증. CSA는 sparse selection을 통한 fine-grained recall, HCA는 heavy 압축으로 dense scan을 동시에 가져가는 분업이 핵심.
- **mHC = doubly-stochastic 제약**은 hyper-connection 류 deep residual width 확장에서 가장 큰 실용적 장벽인 학습 불안정 문제를 manifold projection으로 풀어낸 실용 사례. Sinkhorn-Knopp 20 iter라는 비교적 가벼운 비용으로 spectral non-expansiveness를 보장한다.
- **OPD가 mixed RL을 완전 대체했다는 사실**이 향후 frontier post-training paradigm의 큰 시그널 — multi-domain specialist + on-policy distillation은 **단일 RL stage의 reward hacking과 stability 문제를 분할 정복**으로 우회. Generative Reward Model을 actor와 통합 학습하는 것은 self-rewarding LM 라인의 production-scale 구현체.
- **Anticipatory Routing**(routing 결정에 historical params 사용)은 1.6T MoE 학습 안정화를 위한 비교적 저렴한 트릭으로, 향후 trillion-scale MoE 학습에 표준화될 가능성이 높다. SwiGLU clamping과 함께 "outlier 직접 억제 + 원인 cycle 차단"이라는 두 축으로 구성.
- **3-6개월 격차** 자체 인정: open frontier가 GPT-5.4/Gemini-3.1-Pro와 closing the gap에 들어왔지만 SimpleQA(parametric knowledge), HLE(reasoning) 같은 **knowledge-intensive 영역에서는 여전히 -18~-7pp 격차**. 반대로 LiveCodeBench / Codeforces / SWE Verified 등 **검증가능 도메인에서는 동률 또는 우위** — RL/OPD가 verifiable reward에서 더 잘 작동함을 시사.
- 아키텍처가 **"여전히 너무 복잡하다"고 저자 자체 인정** — 향후 더 elegant하게 단순화 + sparse embedding 도입 + multimodal 확장 + 안정화 트릭의 이론적 이해를 future work로 명시.

## Follow-Up Questions

1. CSA(m=4 압축 + top-k sparse)와 HCA(m'=128 압축 + dense)를 layer 단위로 인터리빙해야 하는 본질적 이유는 무엇인가? 단일 layer에서 두 mechanism을 head 분리로 결합하거나, layer 비율(예: 2:1) 어디가 최적인지에 대한 ablation이 부재한 상태에서 인터리빙이 본질적 설계인지 또는 hyperparameter 선택인지 어떻게 해석해야 하는가?
2. Manifold-Constrained Hyper-Connections에서 doubly stochastic 매니폴드(Birkhoff polytope)로의 projection이 spectral non-expansiveness ‖B_l‖_2 ≤ 1을 보장하는데, 이는 단순 spectral normalization이나 weight orthogonalization 같은 더 가벼운 제약 대비 실질적 우위가 있는가? Sinkhorn-Knopp 20 iter의 추가 cost를 정당화하는 실험적 분리가 가능한가?
3. On-Policy Distillation이 mixed RL을 완전히 대체할 수 있다는 주장의 한계는? 특히 reward hacking이 발생할 수 있는 영역(예: open-ended generation, 사용자 선호도)에서 specialist의 RL 단계가 이미 hacked policy로 수렴해버리면, OPD는 그 결함을 fully transfer할 위험이 있지 않은가? Generative Reward Model을 actor와 통합 학습하는 paradigm이 이를 어떻게 완화하는가?
4. V4-Pro-Max가 SimpleQA-Verified 57.9 vs Gemini-3.1-Pro 75.6, HLE 37.7 vs 44.4로 knowledge-intensive 영역에서만 두드러진 격차를 보이는 반면 LiveCodeBench/Codeforces에서는 동률 또는 우위 — 이 비대칭은 (i) 사전학습 데이터 양/품질 차이, (ii) RL/OPD가 verifiable reward에서 효과적인 반면 parametric knowledge 학습에는 기여 미미, (iii) MoE activated parameter 49B의 한계 중 어느 요인이 dominant한가?
5. 1.6T MoE 학습 안정화를 위해 Anticipatory Routing(historical θ_{t-Δt}로 routing index 미리 계산)을 도입했는데, 이 방법이 자동으로 spike 감지 시에만 활성화된다는 점은 평소 학습 동역학 자체에 routing-backbone update의 동기성이 본질적 위험으로 자리잡고 있음을 시사하지 않는가? 향후 trillion-scale MoE의 표준 학습 루틴으로 routing decoupling이 자리잡으려면 어떤 이론적 이해가 필요한가?
6. Knowledge2Deck 컨텍스트에서 본 논문의 attention 압축은 같은 deck의 MesaNet(250605)이 제시한 "RNN inner-loop를 정확하게 풀어 transformer parity" 접근과 정반대 방향 — V4는 transformer 골격 유지 + 압축으로 1M context 도달. 두 접근의 장기 trade-off는 무엇이며, in-context recall (V4가 V3.2 대비 명백 향상)과 raw long-context efficiency 측면에서 어느 paradigm이 frontier로 살아남을 가능성이 높은가?
7. 자체 진단된 "frontier 대비 3-6개월 격차" 가 real-world 사용에서는 어디까지 의미 있는가? 특히 Chinese writing(Gemini 대비 62.7% win), R&D coding(Opus 4.5에 근접 67% vs 70%), agent 평가(MCPAtlas/Toolathlon에서 generalization 강세)에서 closed model 대비 강점이 명확하다면, 단순 benchmark 격차가 production deployment 결정에 얼마나 load-bearing한가?

## Answers

**1.** 인터리빙의 합리적 근거는 **두 압축 mechanism이 최적화하는 정보 손실 방향이 직교**한다는 점이다. CSA는 m=4의 가벼운 압축으로 fine-grained 정보를 보존하되 top-k sparse selection으로 "어떤 entry를 볼지"를 학습하고 — 이는 needle-in-haystack 류 정확 재현에 강하다. 반면 HCA는 m'=128의 heavy 압축으로 long-range coarse summary를 dense하게 처리해 global context understanding과 trend tracking에 강하다. 인터리빙은 layer마다 두 종류의 정보를 번갈아 다듬는 자연스러운 분업이 되며, 단일 layer에서 head 분리하면 head별 dimension이 줄어 양쪽 모두 약화된다. 다만 논문은 첫 2 layer를 SWA-only, 이후 CSA-HCA 인터리브로 fix하고 ablation은 안 했으므로 "최적 비율"이 알려져 있지 않은 hyperparameter 선택의 측면이 분명히 있다. 향후 비율 sweep ablation이 표준 후속 연구가 될 것이다.

**2.** 단순 spectral normalization은 ‖B‖_2 ≤ 1만 보장하지만 doubly stochastic 제약은 추가로 **row/column sum = 1**이라는 구조 보존을 보장해, residual 업데이트가 "확률적 혼합" 의미를 유지한다 — 신호의 magnitude가 단순 축소가 아니라 **재분배**된다는 뜻이다. 또한 doubly stochastic matrices는 **곱셈에 대해 닫혀 있어** 깊은 stack에서 누적된 제약 위반이 발생하지 않는다는 강한 성질이 있다(논문이 명시). 이는 spectral normalization이 한 layer 단위로만 보장하는 것과 본질적으로 다르며, 깊은 mHC stack의 stability를 단순 norm 제약보다 strict하게 보장한다. Sinkhorn-Knopp 20 iter cost는 매 forward pass에서 발생하지만 d×n_hc 차원에서 작동하므로 (n_hc=4, d=7168) 실측 overhead는 작다 — orthogonalization 류 weight constraint가 backward pass complexity를 키우는 것과 비교하면 forward-only constraint라는 점이 추가 이득이다.

**3.** OPD의 가장 큰 잠재적 한계는 **specialist의 RL 단계에서 reward hacking이 일어나면 OPD가 그 hacked behavior를 그대로 student로 전사한다**는 것이다. 단일 RL stage에서는 reward signal이 모든 도메인을 통과하므로 한 도메인에서 hacked 패턴이 다른 도메인 reward에 의해 push back될 수 있지만, specialist 단계에서는 격리되어 학습되므로 hacking 검증 압력이 낮다. 이를 완화하는 핵심 장치가 **Generative Reward Model을 actor와 통합 학습**하는 설계다 — actor의 evaluative 능력 자체가 generative 학습 신호와 함께 잡혀, 단순 scalar reward의 gameability를 줄인다. 다만 GRM 자체가 distillation으로 흘러들어가는 student에서는 teacher의 GRM 평가 패턴까지 학습되어 inner-loop self-judging이 strict하게 검증되지 않으면 systematic bias가 누적될 위험이 있다. 따라서 OPD가 mixed RL을 완전 대체할 수 있다는 주장은 verifiable reward 도메인(code, math)에서 가장 강력하고, open-ended/preference 도메인에서는 별도 검증이 더 필요하다고 보는 게 안전하다.

**4.** Verifiable reward 도메인(LiveCodeBench, Codeforces) vs knowledge-intensive 도메인(SimpleQA-Verified, HLE)의 비대칭은 (ii) **RL/OPD가 verifiable signal에서만 효과적**이라는 가설이 dominant하다는 강한 증거다. SimpleQA-Verified와 HLE는 사전학습 단계의 parametric knowledge에 직접 의존하는데, RL은 새로운 사실을 외우게 하지 못하고 기존 knowledge를 잘 surfacing하도록 행동을 미세조정할 뿐이다. (i) 데이터 양은 V4-Pro 33T tokens가 frontier closed model 추정치(50T+)에 미치지 못한다는 점에서 보조적 요인이지만 dominant이라기엔 격차 크기 설명이 부족하다 — Gemini-3.1-Pro가 같은 양의 토큰을 학습했다 가정해도 SimpleQA -18pp는 데이터 quality/curation 차이가 크다. (iii) 49B activated의 한계는 MoE 특성상 sparse 활성이라 효과적 capacity는 더 클 수 있어 dominant이지 않다. 결론: 격차 해소를 위해서는 **사전학습 데이터의 깊이 + parametric knowledge surfacing 전용 post-training** 두 축이 필요.

**5.** 자동 spike-detection 활성화 디자인은 implicit하게 **routing-backbone synchronization이 평시에는 효율적이지만 한 번 outlier가 생기면 vicious cycle을 만든다**는 운영적 진단을 반영한다 — 즉 평시에 anticipatory routing의 routing-quality cost(~20% overhead)를 영구적으로 받아들일 만큼 routing-backbone의 시간적 결합이 항상 위험하지는 않다는 trade-off이다. 그러나 trillion-scale MoE의 표준 학습 루틴으로 routing decoupling이 자리잡으려면 (a) Loss spike와 routing pattern 변화의 **causal direction**이 ablation으로 분리되어야 하고(논문은 상관만 제시), (b) routing의 historical θ_{t-Δt} delay가 학습 동역학에 introduce하는 bias가 정량화되어야 한다. 이론적 이해 측면에서는 mean-field MoE 분석이나 routing function의 Lipschitz 안정성 같은 도구가 필요하며, 현재는 공식 이론 없이 empirical recipe로만 작동하므로 재현이 까다로울 수 있다(저자도 명시).

**6.** 두 paradigm은 본질적으로 **"explicit memory의 형태"** 에 대한 다른 답이다. MesaNet은 매 토큰마다 in-context regression을 풀어 fast weight라는 **압축된 implicit memory**를 만든다 — 이는 d_k×d_v 선형 매핑으로 hard-bound되어 in-context recall에서 transformer KV cache(길이 T 보존)에 본질적으로 밀린다. V4는 **transformer KV cache를 유지하되 압축**하는 방향이라 명시적 메모리의 capacity를 보존하면서 cost만 줄인다. Frontier survival에 결정적인 것은 **in-context recall의 절대 정확도**일 가능성이 높다 — agentic 워크플로우, multi-document 분석, long-horizon code repository navigation 등이 모두 정확한 검색을 요구하기 때문이다. MesaNet은 이 영역에서 본질적 한계를 노출했고 V4는 MRCR 1M 83.5라는 production-grade 수치를 달성했다. 단, MesaNet 류는 **inference cost 절대 하한**이 더 낮을 잠재력이 있어, 1M+ context에서 cost가 prohibitive해지는 시나리오에서는 두 paradigm의 hybrid(예: V4-style 압축 + Mesa-style architectural test-time compute layer)가 자연스러운 통합 방향이다.

**7.** Production deployment 결정에서 benchmark 격차는 **task의 verifiability와 domain specificity**에 따라 가중치가 매우 달라진다. 검증가능 코딩(R&D coding 67% vs Opus 4.5 70%)에서는 격차가 작고 가격 차이(open weight)가 우세할 수 있어 — 실제 발표된 internal survey에서 91% 응답자가 V4-Pro를 default coding model로 수용했다는 점이 시사적이다. Chinese writing/Korean 시나리오는 closed frontier가 학습 데이터 비중을 적게 가져가 V4가 절대적 우위를 보일 수 있고, agent 평가에서 MCPAtlas/Toolathlon generalization 강세는 V4의 sandbox infra(DSec)와 OPD의 multi-domain specialist 학습이 reflect된다. 반면 generic knowledge Q&A(SimpleQA -18pp)에서는 격차가 사용자 경험에 직결되므로 chatbot 일반 사용자에게는 frontier closed가 우세하다. 따라서 "3-6개월 격차"는 chatbot 일반 비교에서는 의미 있지만, **specific deployment(open weight, 1M context, agentic workflow, Chinese 시장)** 에서는 V4가 frontier에 실질적으로 동급 또는 우위라는 production reality가 있다. Deck 독자의 의사결정 frame은 "단일 best 모델 선택"이 아니라 "use case별 routing"으로 잡는 것이 정합적이다.
