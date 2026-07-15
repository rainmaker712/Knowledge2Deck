[Attention to Mamba: A Recipe for Cross-Architecture Distillation](https://arxiv.org/abs/2604.14191)

Authors: Abhinav Moudgil, Ningyuan Huang, Eeshan Gunesh Dhekane, Pau Rodríguez, Luca Zappella, Federico Danieli (Apple, MILA, Flat Iron Institute)

> 사전학습된 Pythia-1B Transformer를 *순수* Mamba로 distill하는 2-stage recipe. Hedgehog linear-attention으로 1차 정렬한 뒤 Mamba init을 만들어 fine-tune한다. 10B token (teacher pretraining의 2.7%) 예산으로 PPL 14.11 vs teacher 13.86; naive direct distillation은 PPL >100. "Hybrid가 필요하다"가 아닌 "init이 본질"이라는 contrarian thesis.

<!-- Panel Verdict: CONDITIONAL -->

> [!WARNING]
> Feasibility Gate에서 R4 비판이 살아남은 채 진입. 이 논문을 인용·참조할 때 다음 confound를 함께 다뤄야 한다.
> - **Baseline split이 다름**: HedgeMamba 10/90 vs Hedgehog baseline 50/50 — Hedgehog 베이스라인은 Stage 2에서 5B token만 받음 (1.8× token 핸디캡).
> - **+Gate 인과 귀속이 약함**: full HedgeMamba 1087M vs Hedgehog 1014M (+7.2% params, +73M). +Gate-alone 컨트롤이 없어 PPL 14.89 → 14.58이 mechanism이 아닌 param-count artifact일 가능성을 배제할 수 없음.
> - **MOHAWK 직접 비교 누락**: Table 1에 prior 3-stage recipe (Bick 2024)가 빠짐. backbone/dataset confound (Phi/C4 vs Pythia/OpenWebText)를 이유로 들지만 동일 setup에서 재현하지 않음.
> - **Long-context와 throughput 미보고**: 학습·평가 모두 seq=1024. Mamba selective-scan dim ≤256가 d=2048에서 8× 직렬화를 강제하는데 inference throughput 수치 없음. SSM으로 가는 동기 자체가 본 논문에서는 검증되지 않음.

- **Mercer-기반 2-stage bridging recipe**: Stage 1은 Hedgehog (Zhang 2024)의 학습된 feature map φ_MLP(x)=σ(Wx+b)로 각 attention block 출력을 cosine similarity loss로 교사에 정렬한다 (1B token, 20K steps, 다른 Transformer 파라미터는 frozen). Stage 2는 Linear-Attention↔SSM 대응(Dao & Gu 2024)을 통해 B(X):=K̂, C(X):=Q̂, X:=V̂, Λ_l≡I, gate=identity, conv=identity로 Mamba를 *initialize*한 뒤 9B token (≈180K steps)에 걸쳐 cross-entropy로 fine-tune (embedding 레이어는 frozen, 나머지 full model 학습). 순수-Mamba (no hybrid) 형태에서 teacher PPL을 0.25 이내로 회복한 첫 공개 recipe. ← R1/Novelty
- **Mechanism — init이 main mover, fine-tune이 budget sink**: Token split ablation이 두 stage 모두 필요함을 보인다. 100/0 (Stage 1만, no FT) PPL 25.71, 0/100 (Stage 1 skip, FT only) PPL 17.08, 10/90 PPL 14.11. Naive direct Transformer→Mamba distillation은 PPL >100으로 붕괴 (Bick 2024 negative result 재확인). Mercer's theorem의 e^{x^Tx'}=κ(x,x')=φ(x)^Tφ(x') 분해가 학습된 φ_MLP를 통한 cosine alignment를 정당화하는 framing이며, 정규화는 V를 all-ones tensor로 확장하고 Λ를 duplicate해 SSM mixer 단일 pass로 계산한다. ← R2/Technical
- **76% PPL gap closure at 2.7% of teacher budget**: HedgeMamba PPL 14.11 vs Pythia-1B teacher 13.86 (gap 0.25); 통제된 Hedgehog baseline 14.89 (gap 1.03) 대비 76% 갭을 좁힘. 10B distillation token = teacher 334B의 2.7%. Token scaling 1B→16.56, 2B→15.61, 3B→15.15, 10B→14.11로 monotonic decrease, saturation 미관찰. 8×A100 기준 12d 9h (selective-scan dim cap으로 8× 직렬화 페널티 포함). ← R3/Impact
- **PPL 회복이 downstream으로 균질하게 전이되지 않음**: Lambada 42.07 → 32.31 (Δ −9.76), HSwag 47.16 → 41.87 (Δ −5.29), BoolQ Δ −5.62, Arc-E Δ −3.32. 반면 Arc-C Δ +0.09, SIQA Δ −0.10는 보존. In-context tracking (Lambada)과 commonsense pattern (HSwag)이 softmax sharpness에 의존하기 때문에 linear approximation으로 잃기 쉬운 능력 클래스가 존재한다는 가설. 위 [!WARNING]에 정리한 baseline split / param-count / MOHAWK 누락 / long-context 미평가 confound도 본 axis의 read에 함께 부각된다. ← R4/Critical
- **K2D 코퍼스 framing inversion**: 기존 Mamba/SSM 노트들 (260104 mHC, 260110 Mamba & SSM)과 Transformer-Mamba 하이브리드 노트들이 SSM을 *from-scratch* 또는 *hybrid 필수*로 다뤘다면, 본 논문은 init quality가 본질이며 hybrid는 부수적이라고 주장한다. K2D의 mid-training/data-curriculum 트랙 (CRoCoDiL, "How to Set the Batch Size", "How to Set the Learning Rate", synthetic data 노트들)과는 직교한다 — 본 recipe는 inference cost shape을 바꾸려는 시도이고 capability를 추가하지는 못한다 (downstream Δ가 일관되게 음수). ← R5/Relevance

## Follow-Up Questions

1. Knowledge2Deck 코퍼스에 이미 자리잡은 Transformer-Mamba 하이브리드 (Jamba/Zamba/Samba 류) 노트들을, 본 논문의 "init이 본질이고 hybrid는 부수적"이라는 주장을 받아들였을 때 어떻게 재해석할 수 있는가? hybrid 레이어를 *학습된 init scaffold*로 간주하는 관점이 기존 노트들과 충돌하는 지점은 어디인가?

2. Stage 1의 손실 함수로 cosine similarity가 사용된 이유는 무엇이며, attention output에 대한 MSE나 attention map에 대한 KL divergence와 비교했을 때 어떤 trade-off를 갖는가? cosine similarity 선택이 Stage 2에서 관찰된 Gate 컴포넌트의 큰 기여(+Gate 추가 시 PPL 14.89 → 14.58)와 상호작용하고 있을 가능성은?

3. HedgeMamba (1087M)와 Hedgehog 기준 (1014M)의 7.2% 파라미터 차이를 통제하지 않은 채 +Gate의 PPL 기여를 주장하는 것은 신뢰할 수 있는가? 1087M로 widened φ_MLP 또는 추가 projection을 가진 Hedgehog 베이스라인이 존재한다면 14.58과 어떻게 비교되겠는가?

4. 본 논문은 sequence length 1024에서만 학습·평가했고 추론 throughput 수치를 제공하지 않는다. Mamba selective-scan의 dim ≤ 256 제약이 d=2048에서 8× 직렬화를 강제한다는 점을 고려할 때, HedgeMamba가 sequence length 2048/4096/16384에서 Pythia-1B teacher 대비 실제로 얼마나 빠른가? "subquadratic inference"라는 동기 자체가 검증되지 않은 채로 남아있는가?

5. Mixer ablation에서 +SSM과 +Conv가 PPL을 14.89로 그대로 두고 +Gate만이 14.58로 움직였다는 사실이, Gate가 Mamba 경로를 학습으로 *우회*시키는 bypass처럼 동작하고 있을 가능성을 시사하는가? 이 경우 forward pass 중 SSM 모듈이 실제로 기여하는 비중은 얼마이며, "HedgeMamba"의 Mamba 정체성은 어디까지 유지되는가?

6. Token scaling 곡선이 10B에서도 monotonic decrease (16.56 → 15.61 → 15.15 → 14.11)로 saturation이 관찰되지 않은 상태에서, PPL은 teacher의 13.86에 수렴할 가능성이 있어 보이지만 Lambada (Δ −9.76)나 HSwag (Δ −5.29) 같은 downstream gap은 PPL과 같은 비율로 좁혀지는가, 아니면 PPL과 분리된 ceiling이 존재하는가? 어느 쪽이든 distillation token 예산을 30–50B로 늘렸을 때의 예측은?

7. Stage 1의 Hedgehog 학습 단계가 implicit "kernel feature curriculum"으로 작동한다고 본다면, 이는 Knowledge2Deck의 mid-training/data-curriculum 노트들 (CRoCoDiL, "How to Set the Batch/Learning Rate" 시리즈, synthetic data 노트들)에서 다루는 "값싼 능력 업그레이드"와 per-FLOP 효율 관점에서 어떻게 비교되는가? architectural distillation과 capability mid-training은 substitute인가, complement인가?

## Answers

**1.** 본 논문의 token-split ablation은 Stage 1 (Hedgehog linearization)에 10%만 배정한 10/90 split이 PPL 14.11로 최선이고, Stage 2 fine-tuning만 단독으로 돌린 0/100은 17.08, Stage 1만 단독으로 돌린 100/0은 25.71로 무너진다는 점을 보여준다. 이는 "구조 변경의 핵심은 init alignment에 1B token만 쓰고, 9B는 Mamba 형태에서의 적응에 쓴다"는 *init scaffold* 해석과 정합적이다. 즉 Mamba 자체가 새 능력을 만든다기보다, Hedgehog로 교사 attention의 kernel feature를 복제한 뒤 SSM/Conv/Gate라는 expressivity slot을 fine-tune으로 흡수시키는 것이 이득의 원천이다. 이 관점을 K2D의 Jamba/Zamba/Samba 노트에 적용하면, 그들의 hybrid layer 역시 "Transformer 능력을 안정적으로 부트스트랩하는 학습된 init"으로 재기술 가능하다.

충돌 지점은 hybrid 노트들이 보통 attention-Mamba 혼합 *비율* 그 자체를 기여 요소로 묘사한다는 점이다. 본 논문의 mixer ablation은 +SSM 14.89, +Conv 14.89, +Gate 14.58로 Gate만이 PPL을 움직이므로, "Mamba 채널을 더 늘렸기 때문에 좋아졌다"는 hybrid 서사는 적어도 1B 규모·OpenWebText 영역에서는 약화된다. 다만 본 논문은 long-context 평가나 추론 throughput을 보고하지 않았으므로(저자도 한계로 명시), hybrid 노트들이 주장하는 "긴 시퀀스에서의 메모리/속도 이득"까지 부정되는 것은 아니다. K2D 코퍼스 차원에서는 hybrid를 init scaffold로 *재라벨링*하되, long-context 동기는 별도 미해결 트랙으로 남겨두는 것이 정합적이다.

**2.** 논문은 Stage 1에서 각 attention block 출력을 교사 출력과 cosine similarity loss로 정렬시킨다고만 밝히고, 손실 함수 선택의 직접적 정당화는 제공하지 않는다. 논문은 명시하지 않았으나 ML 일반지식으로 추론 시, cosine similarity는 출력의 *방향*만 맞추고 norm은 풀어두기 때문에 Hedgehog의 φ_MLP(x) := σ(Wx+b)가 학습 초기 임의의 스케일을 가져도 안정적으로 수렴한다는 장점이 있다. MSE는 norm까지 강제해 학습 초기 gradient가 폭주하기 쉽고, attention map에 대한 KL divergence는 softmax↔linear-attention 간 분포 형태 자체가 다르기 때문에(Mercer 분해에서 e^{x^Tx'} = κ(x,x') = φ(x)^Tφ(x')의 truncation 형태가 동일 분포가 아님) 매칭 대상이 ill-defined가 된다. 즉 cosine은 "같은 Mercer kernel 표현을 학습된 φ로 근사"라는 본 논문의 framing과 가장 호환적이다.

Gate와의 상호작용 가능성은 진지하게 의심해볼 여지가 있다. cosine은 norm을 자유롭게 두기 때문에 Stage 1에서 φ 출력 스케일이 교사와 어긋나 있을 수 있고, Stage 2에서 +Gate가 PPL을 14.89→14.58로 움직인 유일한 컴포넌트라는 사실은 Gate가 채널별 multiplicative scaling으로 그 norm 갭을 보정하고 있다는 가설과 부합한다. +SSM·+Conv가 PPL을 전혀 움직이지 못한 것도 그들이 norm 보정 역할을 갖지 않는다는 점과 일관된다. 이 가설을 검증하려면 Stage 1을 MSE 또는 cosine+norm-matching dual loss로 다시 돌렸을 때 +Gate의 한계 기여가 줄어드는지를 봐야 하는데, 본 논문은 그 ablation을 수행하지 않는다.

**3.** 신뢰성에 명백한 구멍이 있다. 보고된 수치는 Hedgehog 1014M @ 14.89 vs. full HedgeMamba 1087M @ 14.58로 +73M (+7.2%) 파라미터가 동시에 추가됐고, +SSM (1020M)·+Conv (1020M) 모두 14.89에서 움직이지 않으므로 +Gate 단독 효과는 *Gate 컴포넌트가 추가한 파라미터 약 67M*에 대해서만 측정된 것이다. 게다가 mixer ablation은 50/50 split에서 수행됐는데 main 결과의 10/90 split (PPL 14.11)과 학습 예산 배분이 다르므로, +Gate의 한계 기여를 main result에 직접 외삽하는 것 자체가 추가 가정에 의존한다.

논문은 명시하지 않았으나 ML 일반지식으로 추론 시, 1087M로 매칭된 Hedgehog 베이스라인 (예: φ_MLP의 hidden dim을 늘리거나 추가 down-projection 삽입)을 9B token으로 fine-tune했다면 14.58과 14.89 사이의 어딘가에 떨어졌을 가능성이 높고, 둘 사이의 차이가 0.31 PPL에 불과하므로 "+Gate의 진짜 기여"는 통계적으로 robust하지 않을 수 있다. naive direct Mamba distillation이 PPL >100인 것에 비하면 +Gate의 0.31은 결정적 요인이 아니며, 본 논문이 강조해야 할 main mover는 여전히 Stage 1 Hedgehog init (100/0의 25.71 → 10/90의 14.11)이다.

**4.** 검증되지 않은 채 남아있다. 논문은 학습·평가 모두 sequence length 1024에서만 수행했고 추론 throughput을 제공하지 않으며, 저자 스스로 long-context evaluation 부재와 throughput 미보고를 한계로 명시한다. Mamba의 subquadratic 동기는 정확히 long sequence에서 발현되는데, 1024는 Pythia-1B 교사의 quadratic attention도 충분히 견디는 길이이므로 본 실험 setup에서는 efficiency 동기 자체가 작동할 수 없다. 게다가 selective-scan dim ≤ 256 cap이 d=2048에서 8× 직렬화를 강제해 wall-clock 12d 9h on 8×A100 (10B token 학습)이 소요됐다는 점은, 학습 시간은 물론 inference 시간에서도 동일한 직렬화가 발생할 가능성을 시사한다.

논문은 명시하지 않았으나 ML 일반지식으로 추론 시, sequence length L에서 attention은 O(L²d), Mamba selective-scan은 O(Ld·s) (s = state dim)이 이론치이지만 d=2048에 dim cap 256이 강제하는 8× serialization은 상수배에서 큰 페널티로 작용한다. L=2048 정도에서는 attention의 quadratic term이 아직 작아 HedgeMamba가 오히려 *느릴* 수 있고, L=4096–16384에서야 cross-over가 발생할 가능성이 높다. 즉 본 논문은 architectural conversion의 *품질*은 입증했으나 그것을 정당화하는 *효율* 주장은 후속 작업에 미뤄둔 상태다.

**5.** 가능성이 매우 높다. 50/50 split mixer ablation에서 +SSM 14.89, +Conv 14.89, +Gate 14.58로 SSM과 Conv가 PPL을 *전혀* 움직이지 못한다는 사실은, fine-tune 후 모델이 SSM/Conv 경로를 무시하거나 거의 항등에 가깝게 수렴시켰음을 시사한다. 게다가 Stage 2 init 시점에서 gate branch와 conv는 identity로 설정되고 Λ_l ≡ I로 두어 SSM도 사실상 항등 근처에서 출발하므로, gradient가 새로운 SSM dynamics를 학습할 인센티브가 약하다. 그 결과 +Gate가 추가됐을 때만 PPL이 움직인 것은 Gate의 multiplicative path가 Hedgehog Linear Attention 출력에 대한 channel-wise modulation으로 직접 작동하면서 SSM 경로를 사실상 우회시키는 bypass라는 해석과 부합한다.

논문은 명시하지 않았으나 ML 일반지식으로 추론 시, 이를 정량화하려면 학습 후 SSM 경로의 출력 norm 또는 ablation drop (SSM을 0으로 강제했을 때 PPL 변화)을 측정해야 하는데 본 논문은 해당 진단을 제공하지 않는다. 따라서 "HedgeMamba"라는 명칭은 *Mamba 블록의 형태적 골격을 채택했다*는 의미에 가깝고, 실제 sequence-mixing 의미에서의 Mamba dynamics는 1B/10B token 영역에서 거의 활성화되지 않았을 가능성이 크다. 본 논문이 아닌 long-context evaluation에서야 비로소 SSM 경로가 의미 있게 활성화되는지를 검증할 수 있다.

**6.** PPL과 downstream 사이에 분리된 ceiling이 존재할 가능성이 높다. Token scaling 곡선 1B→16.56, 2B→15.61, 3B→15.15, 10B→14.11은 monotonic decrease이지만 한계 개선이 줄어드는 형태(1B→2B에서 0.95, 3B→10B 7배 token으로 1.04)이고, teacher PPL 13.86까지는 0.25밖에 남지 않은 상태다. 그러나 downstream에서는 Lambada Δ −9.76 (42.07→32.31), HSwag Δ −5.29 (47.16→41.87), BoolQ Δ −5.62 (60.82→55.20)처럼 *zero-shot reasoning이 요구되는 과제일수록* 갭이 크고, Arc-C (Δ +0.09)·SIQA (Δ −0.10)처럼 이미 random에 가까운 과제는 갭이 작다. 이는 PPL이 next-token 분포의 평균적 매칭은 잡지만, in-context tracking (Lambada) 또는 commonsense pattern (HSwag) 같은 능력은 attention의 softmax sharpness에 민감하게 의존하며 Hedgehog linear approximation으로 손실되기 쉽다는 가설과 부합한다.

논문은 명시하지 않았으나 ML 일반지식으로 추론 시, 30–50B token으로 distillation 예산을 늘리면 PPL은 teacher 13.86에 0.05 이내로 수렴할 가능성이 크지만 Lambada gap은 절반 정도(Δ −9.76 → Δ −5 전후)에서 saturate할 가능성이 높다. 이는 softmax↔linear attention 간 expressivity gap이 token으로는 더 이상 좁혀지지 않는 architectural floor이기 때문이다. 이 가설을 깨려면 Hedgehog의 φ_MLP 폭을 키우거나, LoLCATs처럼 windowed softmax attention을 일부 layer에 남기는 방향이 필요하다.

**7.** 구조적 distillation은 capability mid-training과 *complement*에 가깝지만, 본 논문 framing 안에서는 substitute로 오해되기 쉽다. Per-FLOP 관점에서 본 논문의 비용은 10B token = teacher 334B의 2.7% (8×A100 기준 12d 9h)이고, 이 예산으로 얻는 것은 "교사의 능력 *유지*하면서 Mamba 형태로 옮기기"이다 — Lambada 32.31, HSwag 41.87처럼 teacher 대비 음의 Δ가 일관되게 발생하므로 새 능력을 *추가*하지는 못한다. 반면 K2D의 mid-training/data-curriculum 트랙(CRoCoDiL, batch/LR 시리즈, synthetic data)은 architecture를 고정한 채로 비슷한 token 예산에서 *capability gain*을 노리며, downstream 점수 자체를 양의 방향으로 움직이는 것이 목표다.

따라서 두 트랙의 작동 변수가 직교한다: architectural distillation은 *inference cost shape*을 바꾸고(Mamba의 subquadratic 동기, 본 논문에선 미검증), capability mid-training은 *task accuracy*를 올린다. 실용적 파이프라인은 (a) Pythia-1B-class teacher에 mid-training으로 capability를 먼저 누적시킨 후, (b) 본 논문 recipe로 Mamba 형태에 distill하는 순서가 자연스럽다 — Stage 1 Hedgehog init이 *kernel feature curriculum*으로 작동한다는 framing은 mid-training의 데이터 curriculum과 학습 신호 종류(MLP feature alignment vs. next-token loss)가 다르기 때문에 둘이 같은 FLOP을 두고 경쟁하지 않는다. 단, 본 논문이 1B 규모·OpenWebText·1024 seq·Pythia teacher 단일 조합에서만 검증됐다는 한계를 감안하면, K2D 차원에서는 두 트랙을 별개 노드로 유지하되 "init scaffold" 관점으로 cross-link를 거는 것이 안전하다.
