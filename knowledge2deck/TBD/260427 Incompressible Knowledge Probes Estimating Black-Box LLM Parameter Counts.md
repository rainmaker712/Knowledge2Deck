[Incompressible Knowledge Probes: Estimating Black-Box LLM Parameter Counts via Factual Capacity](https://arxiv.org/abs/2604.24827)

Bojie Li (single-author)

> We propose Incompressible Knowledge Probes, a benchmark of 1,400 factual questions across seven obscurity tiers designed to measure knowledge that cannot be derived by reasoning or compressed by architectural improvements. Calibrating on 89 open-weight models yields R² = 0.917 between log-parameters and penalized accuracy. Leave-one-out cross-validation shows median error of 1.59× (68.5% within 2×, 87.6% within 3×). For Mixture-of-Experts models, total parameters predict knowledge better than active parameters. Analysis of 96 dated models rejects the "Densing Law" prediction, finding factual capacity continues to scale log-linearly with parameters. The benchmark provides reproducible parameter-count estimates for proprietary LLMs (e.g., GPT-5.5 ~9.7T, Claude Opus 4.6 ~5.3T, GPT-5 ~4.1T) and demonstrates that factual capacity remains a reliable scaling metric even as reasoning benchmarks plateau.

<!-- Panel Verdict: CONDITIONAL -->
<!-- Metaphor: 곡물-기반 측정 실린더 (graduated cylinder with graded sand) -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

밀폐된 불투명 항아리(proprietary LLM)가 있고, 제조사는 부피(parameter count)를 알려주지 않는다. "소금 들었어요?" 같은 질문(상식적 사실)은 어느 항아리든 통과시키니 의미가 없다. 물(MMLU 같은 reasoning benchmark)을 부으면 어느 항아리든 곧 입구 근처에서 saturate해서 변별력을 잃는다. 우리에게 필요한 것은 *압축이 안 되는* 측정 — 아키텍처 트릭이나 학습 요령으로 우회할 수 없는, 항아리가 물리적으로 담을 수 있느냐 없느냐로만 갈리는 grain이다. 이 grain이 본 논문의 "incompressible" factual knowledge다.

### 어떻게 푸는가 (Method)

도구는 **알갱이 굵기로 등급을 나눈 모래 1,400개를 부어 측정하는 graduated cylinder**다.

- **모래(probes) 1,400개**: 알갱이 굵기에 따라 7개 tier로 200개씩 나눈다. T1이 가장 굵은 흔한 사실(예: 잘 알려진 기관의 설립 연도), T7이 가장 미세한 niche 사실. 출처는 섞여 있다 — Wikidata 설립연도 알갱이 557개, DBLP/arXiv 연구자 subfield 알갱이 345개, 손으로 빚은 알갱이 97개, 그리고 GPT-5가 후보를 생성해 채운다. 단, GPT-5가 만든 알갱이의 ~82%가 자연스럽게 T1–T2(쉬운 tier)로 떨어진다.
- **굵기 지정 방법**: 0.5B부터 frontier까지 6개 landmark 항아리로 등급을 정한다. "k번 landmark는 통과하지만 k-1번은 통과 못 시키는" 알갱이가 tier k로 분류된다. 이 기준에서 monotonic하지 않은 알갱이 ~15%는 버린다.
- **품질 필터**: 추론으로 답이 나오는 알갱이, 모호한 알갱이, 이름 충돌 알갱이, *contamination-prone ML/AI 연구자* 관련 알갱이, 단일-이름 모호성 알갱이를 모두 배제한다. (마지막 두 항목은 항아리들이 학습 시 본 적 있는 텍스트라 측정이 오염되기 때문이다.)
- **읽는 사람**: Gemini-3-Flash가 4점 척도 judge — CORRECT (+1.0), CORRECT_WEAK (+0.5), REFUSAL (0), WRONG (λ=-1.0). 각 tier 평균을 내고, 7개 tier mean을 unweighted 평균해 overall accuracy를 만든다.
- **눈금 보정**: 부피를 *아는* 89개 open-weight 항아리에 모래를 부어, accuracy A vs log₁₀(N) 직선을 그린다.

> **A = 0.147 · log₁₀(N) + β**, R² = **0.917**

10배 부피 늘 때마다 +14.7 percentage points의 capture rate를 얻는다는 뜻이다. Dense-only로 좁혀도 R²=0.880. 다실(多室) 항아리(MoE)는 *총 부피*로 읽어야 한다 — total-param regression R²=0.79 vs active-param R²=0.51로, 지금 이 turn에서 활성화된 expert만 보면 잘못 읽는다. 측정하려는 밀폐 항아리에 1,400개를 부어 fill-line을 읽고, 직선을 거꾸로 풀어 부피를 추정한다.

### 무엇을 얻었나 (Result)

눈금이 충분히 날카롭다. LOOCV median fold error는 1.59×, 68.5%가 2× 이내, 87.6%가 3× 이내에 떨어진다.

밀폐 항아리들의 fill-line을 읽어 보면:

| 항아리 | 추정 부피 |
|---|---|
| GPT-5.5 | ~9.7T |
| Claude Opus 4.6 | ~5.3T |
| GPT-5 | ~4.1T |
| o1 | ~3.5T |

Proprietary fleet 전체가 1.4× 이내로 수렴하고 있다 (3.0–4.1T 대역) — 경쟁 lab들이 결과적으로 비슷한 크기의 항아리에 도달했다는 뜻. Pro variant는 1.05–1.13×만 더해진다 — 뚜껑을 새로 칠한 정도지 항아리를 키운 것은 아니다.

가장 묵직한 발견은 *눈금 간격이 31개월 동안 좁아지지 않았다*는 것이다. 2023-09 ~ 2026-04 사이의 96개 항아리를 `accuracy = β₀ + β₁·log₁₀(N) + β₂·months`로 합쳐 회귀하면, 시간 계수 β̂₂ = **−0.0010/month**, 95% CI [−0.0031, +0.0008], p=0.34로 0과 구별되지 않는다. "Densing Law"가 예측한 +0.0117/month (capability density가 ~3개월마다 두 배) 시나리오는 p<10⁻¹⁵으로 기각된다. 즉 1mL의 parameter는 2년 전이나 지금이나 같은 굵기의 grain을 담고 있다. Proprietary fleet의 capability 성장은 *전부 부피 확장*에서 왔지, 알갱이를 더 빽빽이 채우는 architectural compression에서 온 게 아니다 — reasoning benchmark가 saturate하는 와중에도.

Tier별로는 T3이 가장 가파르게 변별 (slope 0.324/decade), T6이 proprietary와 open-weight 천장을 가르고, T7은 모든 항아리에 대해 hard ceiling이다.

### 비유가 깨지는 지점 (Limit)

이 cylinder는 다음 4곳에서 거짓말하고, 1곳에서는 미래에 견디지 못한다.

1. **모래가 오염됐다.** 알갱이를 빻은 광산 — Wikidata, DBLP, arXiv — 이 정확히 항아리들이 학습 시기 마셨던 corpus다. 항아리가 "담은" 것 중 일부는 그저 그 document graph를 *기억하고 있는 것*에 불과하다. 본 논문이 "contamination-prone ML/AI 연구자" 알갱이를 명시적으로 배제한 것은 인정이지 해결이 아니다. 항아리는 시험을 부분적으로 *기억*으로 통과할 수 있다.
2. **저울은 고양이로 calibrate 됐는데 지금 말의 무게를 재고 있다.** 89개 calibration 항아리는 대부분 100B 미만에 몰려 있을 가능성이 높다. GPT-5.5의 9.7T 추정은 fitted range 밖으로 ~100× 외삽한 결과다. 90% prediction interval ±3.00×라는 말은 "9.7T"가 사실은 3.2T–29T 대역을 가리킨다는 뜻이다. 점추정값은 장식이고, 진짜 증거는 order-of-magnitude뿐이다.
3. **Densing 기각은 multicollinearity에 취약하다.** 31개월 창에서 log₁₀(N)과 months는 강하게 상관돼 있다 — 신규 모델일수록 체계적으로 더 크기 때문이다. 회귀가 "더 커졌다"와 "parameter당 더 똑똑해졌다"를 깨끗이 분리하지 못한다. β̂₂의 넓은 CI는 식별 문제(identifiability)를 반영한 것이고, Densing Law의 *모든* 버전을 깬 게 아니라 *특정 slope* (+0.0117/month)와의 비교일 뿐이다. 더 작은 densing 효과는 이 분석으로 배제되지 않는다.
4. **눈금을 읽는 사람이 경쟁사 주방 출신이다.** Gemini-3-Flash가 단독 judge인데, 이 benchmark는 Google 자사 모델도 채점한다. 독립 judge ablation이 없다. λ=-1.0 wrong penalty도 ablation이 없어, 자신만만하게 틀리는 모델 vs 거부하는 모델 간 점수가 어떤 λ에 얼마나 민감한지 알 수 없다. 게다가 이 모든 선택은 single-author 논문에서 동료 검토 없이 이루어졌다 — adversarial scrutiny 자체를 통과한 적이 없다.
5. **T7은 모든 항아리에 대해 hard ceiling**이다. GPT-6이 출시되는 순간 일곱 번째 눈금은 다시 깎아야 하고 calibration 전체가 흔들린다. 본 논문의 frontier 추정값은 *유효기간이 박혀 있는* 측정이다.

비유가 *말하지 않는 것* 하나 더: factual capacity는 LLM의 한 축일 뿐이다. Reasoning, agency, instruction-following, multilingual coverage 같은 능력은 이 측정에 들어오지 않는다. 미세한 grain을 많이 담은 항아리가 그것을 잘 *따라낼 수 있는지*는 별개의 문제다. cylinder 읽기는 부피 측정이지 기능 측정이 아니다.
