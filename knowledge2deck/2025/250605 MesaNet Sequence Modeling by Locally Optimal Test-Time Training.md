[MesaNet: Sequence Modeling by Locally Optimal Test-Time Training](https://arxiv.org/abs/2506.05233)

Johannes von Oswald, Nino Scherrer, Seijin Kobayashi, Luca Versari, Songlin Yang, Maximilian Schlegel, Kaitlin Maile, Yanick Schimpf, Oliver Sieberling, Alexander Meulemans, Rif A. Saurous, Guillaume Lajoie, Charlotte Frenkel, Razvan Pascanu, Blaise Agüera y Arcas, João Sacramento

> 매 timestep마다 in-context regularized least-squares를 conjugate gradient로 **최적해**까지 푸는 linear-attention RNN("Mesa layer"). 1-step gradient 근사(GLA/DeltaNet)에서 closed-form ridge solution으로의 도약으로, 1B/50B SlimPajama에서 Transformer와 perplexity 동률(13.79)을 달성한다 — 단, in-context recall에서는 여전히 Transformer ≫ MesaNet.

<!-- Panel Verdict: CONDITIONAL — R4(Critical)는 (a) 50B token 학습은 frontier 대비 ~200× 부족, (b) SWA-1024가 32k에서 경쟁력이라 long-context 내러티브가 약하다, (c) 9-30× GLA inference cost가 production에 부담, (d) parameter-matched 비교만 있고 compute-matched 비교 부재의 우려를 제기. R5(Relevance) 통과로 진행. -->

## Key Contributions

- **Locally Optimal Test-Time Training**: 기존 modern RNN(GLA, DeltaNet, Mamba2)이 매 step **단 1회 gradient step**으로 fast weights를 갱신하던 것을, Mesa layer는 매 timestep마다 누적된 모든 (k, v) 페어에 대한 정규화 ridge regression을 **closed-form 최적해**까지 풀어 fast weights로 사용한다. "online SGD → batch optimal solution"으로의 질적 도약. (R1 Novelty)
- **이중 상태 재귀 + CG-기반 병렬화**: 분모 그램 행렬 H_t = γ_t H_{t-1} + β_t k_t k_t^T와 분자 G_t = γ_t G_{t-1} + β_t v_t k_t^T를 분리 유지하고 (eq.6), H_t·p 행렬-벡터 곱이 GLA-style 누적합 ∑ζ_ti k_i (k_i^T p)로 환원되는 점을 이용해 conjugate gradient를 chunkwise 병렬로 학습한다 (eq.7-8). 명시적 역행렬 없이 forget gate γ→1 영역에서도 수치 안정성 확보. (R2 Technical)
- **Dynamic test-time compute 할당**: head/layer별 H_t condition number에 따라 CG 반복 수를 ε=10^-4 잔차 기준으로 동적 종료하면 평균 ~9 step(고정 30 step 대비)으로 동등 perplexity. 이는 architecture 내부에서 일어나는 적응적 inference compute로, 외부 reasoning RL/CoT의 architectural counterpart에 해당. (R2/R3)
- **시퀀스 내 RNN-Transformer 비대칭의 메커니즘적 정량화**: RNN은 <64 tokens에서 NLL 0.5+ 우위, transformer는 후반에서 우위라는 패턴을 직접 측정하고, MesaNet이 RNN의 우위 영역을 ~512 tokens까지 연장함을 보였다. 1B/50B SlimPajama에서 MesaNet 13.79 ≡ Transformer 13.79 동률, MAD 76.1% (Mamba2 66.0%, xLSTM 73.2%, DeltaNet 67.7%) ≈ Transformer 75.8%, RegBench에서 첫 linearized transformer가 transformer에 필적. (R3 Impact)
- **[!WARNING] 한계**: 50B 학습 토큰은 frontier 대비 ~200× 부족하여 scaling-law 보존 미검증. 32k extrapolation에서 SWA-1024가 경쟁력이라 long-context 내러티브가 약함. In-context recall에서 Transformer ≫ MesaNet 격차는 d_k×d_k rank bottleneck과 softmax sharpness 차이가 동시에 작용한 것으로 추정되며, ablation으로 분리되지 않음. Inference 비용 9-30× GLA는 dynamic stopping의 평균값이며 worst-case는 여전히 30× 부근. (R4 Critical)

## Method / Architecture

**Linear attention 토대 (eq.1-2):** Δe_t^lsa = Φ_t q_t, Φ_t = γ_t Φ_{t-1} + β_t v_t k_t^T (forget γ_t, input β_t).

**Test-time training 통일 시각:** Modern RNN을 inner objective에 대한 1-step optimizer로 재해석. GLA ≈ Hopfield-style loss의 1-step gradient, DeltaNet ≈ squared-error의 online update.

**Mesa 목적함수 (eq.4):**
```
Φ^mesa_t = argmin_Φ [ (1/2) Σ_{t'≤t} ||v_{t'} - Φ k_{t'}||² + (1/2) Tr(Φ^T Λ Φ) ]
```
정규방정식: H_t Φ_t^T = G_t^T, 여기서 H_t는 d_k×d_k 그램 행렬, G_t는 d_v×d_k. 양쪽 다 재귀 유지(eq.6).

**병렬 구현:** Mesa 출력을 (a) GLA-동치 항 + (b) 선형 시스템 해 항으로 분해(eq.8). (b)는 conjugate gradient로 풀고, CG 각 iteration의 H_t·p 곱이 다시 GLA-style 누적합 ∑ζ_ti k_i (k_i^T p)로 환원되어 chunkwise 병렬 학습 가능.

**Dynamic stopping:** ε=10^-4 잔차 기준 → 평균 ~9 CG iter (고정 30 대비). Condition number가 head/layer별로 달라 자연스럽게 적응적 compute 분배.

## Results

| 벤치마크 | MesaNet | Transformer | Mamba2 | xLSTM | DeltaNet | Gated DeltaNet |
|---|---|---|---|---|---|---|
| 1B/50B SlimPajama PPL ↓ | **13.79** | 13.79 | 14.58 | 14.03 | 14.05 | 13.87 |
| MAD synthetic avg ↑ | **76.1%** | 75.8% | 66.0% | 73.2% | 67.7% | — |

- **RegBench (PFA grammar induction):** MesaNet은 transformer에 필적하는 첫 linearized transformer.
- **Within-sequence asymmetry:** RNN <64 tokens 0.5+ NLL 우위, MesaNet은 ~512 tokens까지 우위 연장.
- **32k length extrapolation:** MesaNet > Hawk/GLA/xLSTM, but **SWA-1024는 경쟁력** (long-context 내러티브 약화).
- **Downstream:** Global reasoning (Lambada/HellaSwag/RACE) — MesaNet > 다른 RNN, < Transformer. Local reasoning (PIQA/WinoGrande/ARC) — 대등. **In-context recall — Transformer ≫ MesaNet ≥ other RNNs.** Few-shot (word scrambling) — MesaNet > Transformer.
- **Inference cost:** 30 CG step ≈ 30× GLA cost; dynamic stopping(ε=10^-4) → 평균 ~9 step. 학습 시간은 transformer와 경쟁력 (t·H 선형 시스템을 layer당 풀어야 함에도).

## Takeaways

- "Modern RNN의 약점은 architecture가 아니라 inner optimizer의 quality였다"는 reframing — gradient 1-step을 closed-form으로 바꾸는 것만으로 transformer-parity perplexity를 달성한다는 것이 가장 큰 실증적 시사점.
- Architectural test-time compute (Mesa CG iter)와 inference-time test-time compute (CoT, reasoning RL)는 substitution이 아니라 stack 가능 — MesaNet 위 reasoning RL은 recall-bound subtask에서 marginal benefit이 줄지만 planning/search bound에서는 그대로 유지될 가능성.
- 시퀀스 내 RNN-vs-Transformer 비대칭의 메커니즘적 정량화는 hybrid architecture 설계에 layer-wise 비율 외에 **position-wise routing**이라는 새 축을 시사 — 앞 N 토큰은 Mesa, 이후는 attention 으로 라우팅하는 mixture-of-depths-style 변형이 자연스러운 후속.
- 한계의 가장 critical한 축은 **rank bottleneck**: d_k×d_k 그램 행렬이 in-context에서 동시 활성화 가능한 직교 key 수를 d_k로 hard-bound하므로, T ≫ d_k인 long-context recall에서 Transformer KV cache 대비 격차는 mesa-optimization으로 닫히지 않는다 — "linear inner model + closed-form" 조합의 본질적 한계.

## Follow-Up Questions

1. (R1) "최적해 vs 다단계 근사해"는 본질적 차이인가, 아니면 Λ regularization + 모든 과거 동등 가중의 inductive bias 차이인가? K→∞ inner-step DeltaNet이 Mesa에 점근하는가?
2. (R1) Titans/TTT-layer (nonlinear inner model + multi-step optimizer)와 Mesa(linear inner model + closed-form)의 trade-off — recall-intensive task에서 무엇이 유리하며, >512 토큰 영역에서 nonlinear TTT가 우위로 돌아서는가?
3. (R2) γ_t → 1 영역에서 H_t 조건수 κ는 시퀀스 길이에 따라 어떻게 증가하며, CG 수렴이 √κ에 비례한다는 표준 결과에 비추어 "forgetting-무관 안정성" claim은 (a) Λ 정규화, (b) key의 effective rank 한계, (c) 평가 시퀀스 길이 제한 중 어디에서 오는가?
4. (R2) MesaNet의 perplexity는 Transformer와 동률(13.79)인데 in-context recall에서는 Transformer ≫ MesaNet인 격차의 원인은 (a) softmax 비선형 표현력, (b) d_k × d_k rank bottleneck, (c) γ_t·β_t gating의 forgetting-induced 정보 손실 중 무엇이며, ablation으로 분리할 수 있는가?
5. (R5) "Computational buffer effect"(Thinking to Recall, 260310)를 architectural inner-loop로 흡수할 때, MesaNet 위에서 reasoning RL의 marginal benefit은 Transformer 위에서의 그것 대비 어떻게 변하며, architectural test-time compute와 inference-time test-time compute는 substitutable인가 orthogonal인가?
6. (R5) "시퀀스 내 RNN-Transformer 비대칭"은 layer-wise hybrid 대신 position-wise dynamic routing(앞 N 토큰은 RNN, 이후는 attention)을 시사하는가? Engram/HALO 류 layer-단위 hybrid 설계에 이 발견은 어떤 새 hyperparameter를 추가하는가?
7. (R4) Inference cost 9× GLA(dynamic) ~ 30× GLA(fixed)는 동일 perplexity를 더 작은 표준 RNN(state size·layer 폭 키운 GLA/Gated DeltaNet)로 따라잡는 비교에서 어떻게 정당화되는가? Compute-matched가 아닌 parameter-matched 비교가 MesaNet에 유리하게 편향되어 있는가?

## Answers

**1.** 본질적 차이라기보다는 inductive bias의 한 변에 가깝되, 두 축이 분리 불가능하게 얽혀 있다. DeltaNet의 1-step delta rule은 Φ_t = Φ_{t-1} + β_t (v_t − Φ_{t-1} k_t) k_t^T, 즉 새 (k,v) 페어 하나에 대한 SGD 1-step이라서 과거 페어들의 잔차는 다시 보지 않는다. 반면 Mesa는 매 timestep마다 누적된 (G_t, H_t)를 이용해 모든 과거 페어를 동등 가중(γ 누적 weighting 하에)으로 다시 풀기 때문에, 이론적으로 K-step inner gradient를 무한히 돌려 H_t 행렬의 모든 모드를 수렴시키면 Mesa의 ridge solution Φ_t = (H_t + Λ)^(-1) G_t에 점근해야 한다. 다만 DeltaNet은 Λ regularization 항이 명시적으로 없고 sequential update라 그 극한은 (H_t)^+ G_t에 가까워 ill-conditioned 영역에서 발산할 위험이 있고, 이는 정확히 논문이 G_t와 H_t를 분리해 유지하는 이유와 맞닿는다. 따라서 "다단계 근사 → 최적해"라는 단일 축이 아니라, (i) closed-form vs iterative, (ii) ridge regularization 유무, (iii) 과거 잔차 재방문 여부 세 축의 결합이 격차를 설명한다고 보는 편이 정확하다.

**2.** Titans/TTT-layer 계열은 inner model을 MLP로 두고 SGD 다단계로 돌려 표현력을 사는 대신 closed-form을 잃는데, 이 trade-off는 recall 형태에 따라 갈린다. Pure key-value lookup(needle-in-haystack, MAD recall)에서는 inner model이 linear여도 충분하므로 Mesa의 정확한 ridge solution이 더 유리하다 — 실제 MAD 76.1%는 nonlinear inner-loop가 굳이 필요 없음을 시사한다. 반면 fuzzy recall, paraphrased retrieval, 또는 key 자체가 컨텍스트에 의해 변형되어야 하는 상황에서는 nonlinear inner model이 더 풍부한 매니폴드를 학습할 수 있어 >512 토큰 영역에서 우위로 돌아설 가능성이 있다. 다만 논문이 보여준 32k extrapolation에서 MesaNet이 Hawk/GLA/xLSTM을 능가하면서도 SWA-1024와 동급이라는 점은, 길이가 늘어날수록 "정확한 linear solver" 자체보다 attention 류의 explicit memory가 다시 중요해진다는 신호로 읽힌다. 따라서 nonlinear TTT가 자동으로 우위가 되기보다는, recall 모드(exact vs associative)와 길이 두 축에서 결정될 가능성이 크다 — 이 부분은 직접 비교 실험이 없어 추론이다.

**3.** 표준 CG 이론에서 ε-수렴까지의 반복 수는 O(√κ log(1/ε))이고, H_t = ∑ γ누적 · k_i k_i^T는 γ_t → 1에서 새 outer product가 계속 누적되므로 가장 큰 고유값은 시퀀스 길이 T에 선형, 가장 작은 고유값은 key 분포의 effective rank가 포화되는 시점부터 정체되어 κ가 발산할 위험이 있다. 그럼에도 dynamic stopping이 평균 ~9 iter로 안정적인 이유는 세 효과의 합으로 설명된다. (a) Λ regularization이 H_t + Λ의 최소 고유값에 floor를 깔아 κ ≤ (λ_max(H) + λ_min(Λ))/λ_min(Λ)로 묶어주고, (b) d_k차원에서 key의 effective rank가 d_k 이상으로 늘 수 없어 H_t는 본질적으로 low-rank-plus-floor 구조를 가지며, 이 경우 CG는 활성 모드 수만큼만 step이 필요해지고, (c) 학습/평가가 4k-32k 범위라 아주 긴 시퀀스에서의 점근적 κ 폭발은 실측에 안 잡힌다. 즉 "forget-무관 안정성"은 주로 (a) ridge floor에서 오는 보장이고 (b)는 보조, (c)는 reported regime에 한정한 caveat라고 봐야 안전하다 — 100k+ 토큰 regime에서 동일 claim이 유지될지는 별도 검증이 필요하다.

**4.** 세 가설을 분리해 보면 (b) rank bottleneck이 1순위, (a) softmax 표현력이 2순위, (c) gating-induced loss는 부차적이라고 보는 편이 정합적이다. MesaNet의 effective memory는 (H_t + Λ)^(-1) G_t로 본질이 d_k × d_v 선형 매핑인데 d_k가 head dimension(보통 64-128)으로 묶여 있어, in-context에서 동시에 활성화 가능한 직교 key 수가 d_k개로 hard-bound된다 — Transformer의 KV cache는 T개 페어를 그대로 보존하므로 T ≫ d_k에서 격차가 벌어지는 것이 자연스럽다. (a) softmax는 sharp retrieval(top-1 selection)을 quasi-discrete하게 수행해 noise-robust한 반면 ridge regression은 smooth interpolation이라 distractor 페어가 많을 때 답이 흐려진다 — 이는 perplexity(평균적 예측)에서는 안 잡히지만 recall(rare-token 정확 재현)에서 드러나는 비대칭과 일치한다. (c)는 γ_t < 1 누적이 오래된 페어를 약화시키지만 in-context recall task는 보통 단일 시퀀스 내라 dominant factor는 아닐 것이다. Ablation은 d_k를 키워 rank를 풀거나(→ b 검증), Λ를 0으로 보내 sharpness를 키우거나(→ a 부분 검증), γ_t = 1로 고정(→ c 분리)하는 식으로 가능하지만 논문에는 이 분해가 빠져 있다.

**5.** Architectural inner-loop와 inference-time CoT/RL은 부분적으로 겹치되 본질적으로 orthogonal에 가깝다. Mesa의 inner-loop는 token 단위로 KV-association을 closed-form으로 푸는 retrieval-side 계산이고, reasoning RL은 token 시퀀스 위에서 multi-step planning과 self-verification을 학습시키는 generation-side 계산이라 풀고자 하는 문제가 다르다 — Thinking-to-Recall(260310)이 보인 "computational buffer effect"는 실제로는 generation 중간에 토큰을 더 뽑아 working memory를 외재화하는 효과인데, MesaNet은 그 buffer를 layer 내부 H_t로 흡수하므로 정확한 lookup에서는 이득이 겹친다. 따라서 MesaNet 위에서 reasoning RL의 marginal benefit은 (i) recall-bound subtask에서는 줄어들고, (ii) compositional planning·search-bound subtask에서는 거의 그대로 유지될 것으로 예측된다. 흥미로운 시사점은 deck의 "test-time compute를 어디에 배치하는가"라는 질문에서 architectural(매 token, layer 내부, 미분가능)과 inference-time(시퀀스 위, generation, RL로 학습) 두 축이 substitution이 아니라 stack 가능하다는 점이고, MesaNet의 dynamic stopping은 사실상 "architectural adaptive compute"라 RL 기반 adaptive thinking budget과 자연스러운 짝이 된다.

**6.** 강하게 시사한다 — 다만 논문 자체는 layer-wise를 가정하고 실험했음을 유의해야 한다. <64 토큰에서 RNN이 우위, 후반에서 attention이 우위라는 비대칭은 컨텍스트의 "정보 밀도/거리 분포"가 position에 따라 다르다는 뜻이고, 이를 모든 layer에서 균등하게 처리하는 layer-wise hybrid(예: Engram의 K개 layer는 RNN, 나머지는 attention)는 position 축을 활용하지 못한다. Position-wise dynamic routing — 앞 N 토큰은 Mesa로 처리하고 N 이후 query만 attention sink로 라우팅 — 으로 가면 (i) routing threshold N(또는 학습 가능한 gate), (ii) 짧은 prefix용 RNN과 긴 context용 attention의 KV 공유 여부, (iii) train-time과 inference-time의 N 분포 mismatch를 보정할 schedule 세 가지 새 hyperparameter가 추가된다. HALO 류에서 layer 단위 hybrid에 이 결과를 반영한다면, 적어도 layer 비율 자체를 token position에 따라 다르게 라우팅하는 mixture-of-depths 류 변형이 자연스러운 다음 단계가 된다 — 이 부분은 deck의 hybrid architecture 라인과 직접 연결되는 미해결 설계 공간이다.

**7.** 9-30× GLA cost는 두 가지 비교 frame에서 다르게 보인다. Parameter-matched 1B 비교에서 MesaNet 13.79가 Gated DeltaNet 13.87, Mamba2 14.58을 이긴 것은 사실이지만, GLA의 state size를 d_k → 2d_k로 확장하거나 layer 수를 늘려 inference FLOPs를 9× 맞추면 과연 13.79에 도달하는가는 논문에서 직접 비교하지 않았다. 표준 RNN scaling law가 state size에 sub-linear한 perplexity 개선만 주는 것이 실증된다면 MesaNet의 우위는 진짜 architectural advance이지만, state-size scaling이 거의 선형에 가깝다면 "compute를 inner-loop에 쓰느냐 state width에 쓰느냐"의 단순 재배분일 수 있다. 따라서 R4 관점에서 본 fair benchmark는 (a) parameter-matched(현행), (b) inference-FLOPs-matched, (c) memory-bandwidth-matched 세 표가 모두 있어야 하며, MesaNet 논문은 (a)만 충실히 다뤘다. 추가로 dynamic stopping이 평균 9× 라지만 worst-case head/layer는 여전히 ~30×에 가까울 수 있어, latency-critical 배포에서는 평균이 아닌 P99 비교가 필요하다 — 이 부분이 deck의 "production efficiency" 시각에서 비판적으로 짚어둘 한계다.
