[Embarrassingly Simple Self-Distillation Improves Code Generation](https://arxiv.org/abs/2604.01193)

Ruixiang Zhang, Richard He Bai, Huangjie Zheng, Navdeep Jaitly, Ronan Collobert, Yizhe Zhang

> Can a large language model (LLM) improve at code generation using only its own raw outputs, without a verifier, a teacher model, or reinforcement learning? We answer in the affirmative with simple self-distillation (SSD): sample solutions from the model with certain temperature and truncation configurations, then fine-tune on those samples with standard supervised fine-tuning. SSD improves Qwen3-30B-Instruct from 42.4% to 55.3% pass@1 on LiveCodeBench v6, with gains concentrating on harder problems, and it generalizes across Qwen and Llama models at 4B, 8B, and 30B scale, including both instruct and thinking variants. To understand why such a simple method can work, we trace these gains to a precision-exploration conflict in LLM decoding and show that SSD reshapes token distributions in a context-dependent way, suppressing distractor tails where precision matters while preserving useful diversity where exploration matters. Taken together, SSD offers a complementary post-training direction for improving LLM code generation.

## Key Contributions

- SSD (Simple Self-Distillation): verifier, teacher 모델, RL, 코드 실행 환경 없이 모델 자신의 raw 출력만으로 코드 생성 성능 향상
- Qwen3-30B-Instruct: LiveCodeBench v6 42.4% → 55.3% pass@1 (+12.9pp, +30.4% relative). Hard 문제에서 +15.3pp
- Qwen/Llama 4B, 8B, 30B 전 규모, instruct/thinking 변형 모두에서 일관된 개선
- **Precision-Exploration Conflict** 이론으로 SSD 효과 설명: 고정 온도는 lock/fork 위치를 동시에 최적화 불가
- "나쁜 데이터(코드 없는 샘플 62%)"에서도 +5.7pp 향상 → 정답 학습이 아닌 분포 재형성이 핵심

## Method / Architecture

**3단계 파이프라인 (문제 프롬프트 + 베이스 모델만 필요):**

1. **Data Synthesis**: 조정된 temperature(T_train)와 truncation(top-k, top-p)으로 솔루션 샘플링
2. **Training**: 검증 없이 raw 출력으로 표준 SFT 수행
3. **Inference**: 별도의 decoding 파라미터(T_eval, ρ_eval)로 배포

**핵심 이론 — 세 가지 손실 분해:**
- **Support Compression**: truncation이 diffuse tail mass 제거 (lock 위치에서 지배)
- **Within-Support Reshaping**: 남은 토큰 간 probability mass 재분배 (fork 위치에서 유용한 다양성 보존)
- **Alignment Term**: reshaping을 베이스 모델 선호도에 고정

**Lock vs Fork 위치:**
- Lock: 문법/구조상 선택지가 적음 → low temperature(precision) 필요, 낮은 확률의 distractor 억제
- Fork: 복수의 진짜 가능한 continuation 존재 → high temperature(exploration) 필요, 다양성 보존

SSD는 context 의존적으로 이 두 요구를 비대칭적으로 해결.

## Results

| 모델 | Baseline (pass@1) | SSD (pass@1) | 향상 |
|---|---|---|---|
| Qwen3-30B-Instruct | 42.4% | 55.3% | +12.9pp |
| Qwen3-30B Hard | — | — | +15.3pp |
| Qwen3-30B Easy | — | — | +6.5pp |
| Llama-3.1-8B | 기준 | 개선 | 일관적 |
| Qwen 4B/8B | 기준 | 개선 | 규모 전반 |

**주요 ablation:**
- Decode-only temperature 튜닝: Qwen3-30B-Instruct에서 2.2pp 변동에 그침 vs SSD +11.8pp 우위 유지
- T_train × T_eval (training/eval temperature 곱)이 truncation 없이 R²=0.75로 성능 예측 → 높은 T_train이 eval-time 조정 민감도 향상
- T_train=2.0 + 62% 코드 없는 샘플에서도 +5.7pp → 분포 재형성 자체가 핵심

## Takeaways

- **"나쁜 데이터로도 좋아진다"**: 정답 여부보다 sampling distribution 자체가 성능 결정 → 검증 없는 self-improvement 가능
- Decode-only temperature 조정의 근본 한계: 베이스 모델의 token ranking을 바꿀 수 없음, context-dependent reshaping은 학습만 가능
- pass@5가 pass@1보다 더 많이 개선 → SSD가 diversity를 보존함을 확인, 단순 mode-seeking이 아님
- 포스트 트레이닝의 보완적 방향: RL/verifier 없이 SFT만으로 코드 생성 +30% relative, 기존 RL 파이프라인과 결합 가능

## Follow-Up Questions

1. SSD의 precision-exploration conflict 해결 원리가 코드 생성 외 도메인(수학적 추론, 자연어 생성)에도 동일하게 적용되는가? lock/fork 위치의 분포가 도메인마다 다르다면 어떤 조건에서 SSD가 효과적이고 비효과적인가?

2. "나쁜 데이터(코드 없는 62% 샘플)"에서도 개선이 나타나는 현상은 SSD 손실의 어느 분해 항(Support Compression vs Reshaping vs Alignment)에 기인하는가? 순수 분포 재형성 가설을 검증하려면 어떤 통제 실험이 필요한가?

3. T_train × T_eval 곱이 R²=0.75로 성능을 예측한다는 결과는, SSD 이후 eval-time 온도 조정이 추가적인 성능 향상을 위한 실용적 도구임을 시사한다. 그렇다면 SSD와 Best-of-N 샘플링 또는 test-time compute scaling을 결합했을 때 추가 이득이 존재하는가?

4. SSD는 thinking 변형(Qwen3-30B-Thinking)에서도 효과를 보인다. 기본 LLM과 thinking 모델에서 lock/fork 위치의 분포가 다를 것인데, SSD의 context-dependent reshaping이 chain-of-thought 토큰과 코드 토큰에서 각각 어떻게 다르게 작동하는가?

5. SSD는 검증 없이 raw 출력으로 학습한다. 이 과정에서 모델이 자신의 편향(hallucinated API, 잘못된 알고리즘 선택)을 강화할 위험이 있다. 반복적 SSD(SSD on SSD output)를 적용했을 때 성능이 포화되거나 역전되는가? 이 한계를 탐지할 수 있는 신호는 무엇인가?

6. SSD에서 최적 T_train이 모델 규모(4B vs 30B)에 따라 다른가? 대형 모델일수록 fork 위치에서 더 좋은 기반 분포를 가지고 있어 낮은 T_train이 더 효과적일 것이라는 가설이 결과와 일치하는가?

7. 코드 외 포스트 트레이닝 파이프라인(예: 한국어 LLM의 Cascade RL)에서 SSD를 RL 이전 워밍업 단계로 활용할 경우, RL의 exploration-exploitation 균형에 어떤 영향을 미치는가? SSD가 fork 다양성을 보존한다는 점에서 RL reward hacking 위험을 줄이는 역할을 할 수 있는가?

## Answers

**1.** lock/fork 분포는 도메인마다 다르다. 수학 증명에서는 단계 연결 토큰("therefore", "=")이 lock, 증명 전략 선택이 fork에 해당한다. 자연어 생성은 코드보다 fork 비율이 높아 SSD의 reshaping 이점이 더 분산될 수 있다. 효과적인 조건: fork/lock 위치가 명확히 구분되고, 잘못된 fork 선택이 cascade failure를 유발하는 도메인(코드, 수학 증명). 비효과적인 조건: 거의 모든 위치가 fork인 창의적 글쓰기 — 전체 분포 suppression이 다양성을 해침.

**2.** "나쁜 데이터" 결과는 주로 Support Compression 항에 기인할 가능성이 높다. 62% 코드-없는 샘플에서도 truncation이 작동하여 tail mass를 제거하면, 모델의 전체 decoding 분포가 더 집중된다. 검증 실험: (a) truncation=1(no truncation) + T_train=2.0의 나쁜 데이터 vs (b) truncation 적용 + T_train=1.0의 좋은 데이터를 비교. (a)가 (b)보다 낮으면 compression이 핵심임을 확인.

**3.** SSD와 Best-of-N의 결합은 유력하다. SSD가 pass@5를 pass@1보다 더 크게 향상시킨다는 결과는 다양성이 보존됨을 보여준다 — Best-of-N의 전제조건. 결합 시나리오: SSD로 기반 분포를 개선한 후 N개 샘플에서 verifier(execution, unit test)가 최선을 선택. SSD는 각 샘플의 품질을 높이고, BoN은 최선을 선택하므로 곱 효과가 기대된다. 단, SSD 이후 온도 조정 여지가 생기므로 eval-time에 T_eval을 조정하면 추가 +2-3pp 가능성 있음.

**4.** Thinking 모델에서 chain-of-thought 토큰은 대부분 fork 위치다 — 추론 방향이 열려있기 때문. 코드 토큰은 앞서 결정된 추론 경로에 따라 lock이 더 많아질 수 있다. SSD는 이를 구분 없이 처리하므로, thinking 모델에서는 CoT의 fork 다양성을 유지하면서 코드 출력의 lock precision을 높이는 효과가 나타날 수 있다. 실증: thinking vs instruct 모델에서 SSD의 pass@5/pass@1 비율을 비교하면 thinking 모델에서 비율이 더 높을 것으로 예상.

**5.** 반복적 SSD의 위험은 실재한다. Artificial Hivemind 논문의 RLHF 동질화 메커니즘과 유사하게, 반복 적용 시 모델 출력이 초기 편향으로 수렴할 수 있다. 포화 탐지 신호: pass@5/pass@1 비율의 감소(다양성 손실), fork 위치의 엔트로피 단조 감소, 특정 API/패턴 사용 빈도의 집중. 실용적 한계: 1-2회 SSD가 최적이며, 이후 외부 데이터(다른 모델의 출력 또는 curated corpus)로 보충하는 혼합 전략이 필요.

**6.** 대형 모델(30B)이 소형(4B)보다 절대 향상폭이 크다는 결과는 일치한다. 그러나 이는 두 가지 해석이 가능하다: (a) 대형 모델이 더 나은 기반 분포를 가져 SSD가 더 효과적으로 reshaping 가능, (b) 대형 모델의 절대 성능 헤드룸이 더 커서 향상 여지가 큼. 최적 T_train에 대한 직접 데이터는 제시되지 않으나, 대형 모델에서 낮은 T_train이 더 안전한 것은 맞다 — fork 위치에서 이미 좋은 분포를 가지므로 너무 높은 T_train은 불필요한 noise를 도입.

**7.** SSD의 fork 다양성 보존 특성은 RL 이전 워밍업으로 유망하다. RL의 핵심 위험인 reward hacking은 모델이 좁은 분포에 고착될 때 발생한다. SSD가 pass@5를 pass@1보다 더 크게 향상시킨다면, RL 시작 시 exploration 공간이 넓어져 보상 신호가 다양한 전략을 평가할 수 있다. `On the Interplay` 논문의 1% 임계값과 연결하면: SSD는 해당 도메인에서의 "노출"을 높이는 수단으로 볼 수 있으며, RL 효과의 전제조건을 충족시키는 역할을 할 수 있다. 한국어 Cascade RL에서의 응용: 수학 → 코드 단계 전환 전에 각 도메인에서 SSD 1회 적용하면 RL 수렴 속도 향상 가능성.
