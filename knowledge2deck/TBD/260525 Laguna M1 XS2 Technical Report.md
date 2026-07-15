[Laguna M.1/XS.2 Technical Report](https://poolside.ai/assets/laguna/laguna-m1-xs2-technical-report.pdf)

Poolside Team (Poolside)

> We present LAGUNA M.1 and LAGUNA XS.2, two Mixture-of-Experts foundation models built for long-horizon, agentic coding: M.1 has 225.8B total parameters (23.4B activated per token) and XS.2 has 33.4B total (3B activated). Both models were trained from scratch end-to-end inside the same internal system that we refer to as our Model Factory: a tightly-integrated stack of versioned data, training, evaluation, and inference components that turn model development into an industrial process. We describe the principles and design choices of the Model Factory and also detail the end-to-end training process of our models, throughout pre-training data and architecture, post-training stages, evaluation, and quantization. On agentic software engineering and terminal benchmarks (SWE-bench Verified, SWE-bench Multilingual, SWE-Bench Pro, and Terminal-Bench 2.0) M.1 and XS.2 are competitive with state-of-the-art open models in their respective weight classes. LAGUNA XS.2 weights are released under Apache 2.0 at https://huggingface.co/collections/poolside/laguna-xs2.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 자동차 공장 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

레이싱카를 만드는 방법은 두 가지다. 첫째, 장인이 차고에서 한 대씩 수작업으로 조립하는 것. 둘째, 자동차 공장을 세워서 설계·연료·엔진·주행 시험을 산업적 규모로 반복하는 것. Poolside가 Laguna M.1과 XS.2를 만들면서 직면한 문제는 정확히 후자의 공장 건설이다. agentic coding이라는 특수 레이스에서 이기는 차를 만들려면 엔진 설계(MoE architecture), 연료 배합(data mix), 트랙 시험(RL on real environments)이 전부 맞물려 돌아가야 하는데, 각 서브시스템이 나머지 전부와 상호작용한다. 연료 배합을 바꾸면 엔진 출력 특성이 변하고, 엔진 구조를 바꾸면 최적 연료가 달라지며, 트랙 시험 결과가 다시 엔진 튜닝을 바꾼다. 수작업 장인의 직관으로는 이 다차원 상호작용을 동시에 최적화할 수 없다 — 공장 수준의 자동화된 파이프라인이 필요하다. M.1은 225.8B total parameter, 23.4B active parameter 규모의 대형 레이싱카이고, XS.2는 33.4B total, 3B active의 경량 레이싱카로 5주 만에 조립되어 Apache 2.0 라이선스로 공개된다. 이 기술 보고서의 핵심 주장은 두 차가 같은 공장 라인에서 나왔고, 그 공장의 설계 자체가 기여라는 것이다.

### 어떻게 푸는가 (Method)

이 공장에는 세 개의 핵심 부서가 있다: 연료 시험실, 엔진 설계실, 그리고 실주행 트랙 시험장.

연료 시험실 — AutoMixer. 50개 이상의 연료 원료 그룹(dataset groups)에서 최적 배합을 찾아야 한다. 본 생산 라인에서 모든 배합을 시험하면 비용이 파괴적이므로, AutoMixer는 60대의 소형 시험 엔진(proxy model, 각각 약 0.5B parameter, 약 60B token으로 학습)을 돌려서 어떤 배합이 본 엔진에서 좋을지를 예측한다. 배합 비율은 Dirichlet 분포 기반 perturbation으로 탐색하고, KL-regularized surrogate optimization으로 수렴시킨다. XS.2의 최종 연료 배합은 raw code 30.6%, web 25.2%, synthetic/code-text 25.4%, math 9.0%, knowledge 6.6%다. 시험 엔진 단계에서의 성능 향상은 HumanEval+ +43%, MBPP+ +15%, Crux-I +54%, Crux-O +48%, GSM8K +41%, MMLU +5%에 달하고, held-out 벤치마크에서도 MATH +25%, LiveCodeBench +39%가 나왔다. 다만 이 연료 최적화에는 trade-off가 있다 — ARC-C에서 -6.8%, WinoGrande에서 -1.4%의 commonsense regression이 발생하며, 이 후퇴가 post-training을 통과한 뒤에도 남아 있는지는 추적되지 않았다.

엔진 설계실 — MoE architecture. 엔진에는 256개의 실린더(expert)가 장착되어 있지만, 매 순간 8개만 점화되고 1개의 상시 가동 실린더(shared expert)가 기본 출력을 보장한다. coefficient 2.5의 부하 분산 설계로, 전체 실린더 수에 비례하지 않는 연료 소비로 대용량 출력을 얻는다. 새시(architecture) 수준에서는 SWA(Sliding Window Attention)와 GA(Global Attention)를 3:1 비율로 교대 배치하고, SWA window는 512, GA에는 partial RoPE 50%를 적용한다. Muon optimizer(Moonlight variant)를 전 단계에 걸쳐 사용했고, WSD(Warmup-Stable-Decay) 스케줄에서 learning rate는 lr* = 10^4.488 · N^(-0.4639) · D^(-0.2661) 공식으로 결정되며, XS.2의 실제 사용 값은 5×10⁻⁴다. M.1은 6,144대의 H200 GPU 위에서, XS.2는 2,048대의 H200 GPU 위에서 조립된다.

실주행 트랙 시험장 — CISPO RL. 이 공장의 차별점은 다이노미터(dyno test) — 즉 정적 벤치마크 위의 supervised fine-tuning — 만으로 차를 출하하지 않는다는 것이다. 차를 실제 레이스 코스에 내보낸다. SWE-bench의 실제 GitHub 리포지토리, Terminal-Bench의 실제 컨테이너 환경이 이 공장의 테스트 트랙이다. 차가 트랙을 돌 때 CISPO(Clipped Importance Sampling Policy Optimization)라는 주행 제어 시스템이 작동한다. 핵심은 안전 거버너의 비대칭 설계다: clip 범위가 (c_low, c_high) = (1, 4)로, effective range는 [0, 5]다. 차가 코너에서 크게 벗어나는 쪽(정책이 급격히 변하는 방향)을 강하게 억제하되, 조금씩 더 잘 달리는 쪽은 상대적으로 허용하는 비대칭 클리핑이다. 랩 타임 측정은 binary 1.0(통과) / 0.0(실패)이고, 파싱 오류에는 -0.1, 최소 스텝 미달에도 -0.1, tool error에는 토큰당 -0.05가 부과된다. LOO(Leave-One-Out) advantage 추정으로 각 주행의 기여를 분리하고, 트랙 시험 팀은 매 2 optimizer step마다 NCCL/RDMA를 통해 조정 결과를 공장 본선의 모델 weight에 동기화한다. 이것이 이 공장의 핵심 루프다 — 실제 코스에서 달려보고, 결과를 공장 설계에 되먹이는 순환.

post-training은 이 세 부서가 순차적으로 맞물리는 조립 라인이다. mid-training 단계에서 60B token(reasoning 40%, coding-agent 30%, chat 30%)을 먹이고, SFT는 3×40B token(85%가 agentic task)으로 진행하며, 최종적으로 실제 코딩 환경 위에서 RL을 돌린다. long-context 확장은 4K → 32K → 128K → 256K의 점진적 스케줄로 이루어진다. 한편, 이 공장은 테스트 트랙 자체의 무결성 문제도 발견했다. 기존 벤치마크 중 일부가 조작되어 있었다(benchmark hacking) — 비유하면 코스의 타이밍 센서가 특정 차에 유리하게 조정되어 있는 상황이다. Poolside는 이를 자체적으로 패치하고 조작 탐지기(reward hack judge)까지 만들었다고 보고한다. 그러나 이 패치와 탐지기가 외부 감사(external audit) 없이 자체 시행되었다는 점은 이후 Limit 섹션에서 다시 짚는다.

### 무엇을 얻었나 (Result)

공장에서 나온 두 대의 차가 레이스에 나선 결과다. M.1은 SWE-bench Verified에서 74.6, Multilingual에서 63.1, Pro에서 49.2, Terminal-Bench 2.0에서 45.8을 기록한다. 경량 모델 XS.2는 같은 트랙에서 Verified 69.9, Multilingual 57.7, Pro 46.3, Terminal-Bench 35.7을 달성한다. XS.2가 3B active parameter로 이 수준의 에이전틱 코딩 성능을 달성한 것, 그리고 5주라는 조립 기간과 Apache 2.0 공개는 같은 공장 라인이 대형차와 경량차를 모두 빠르게 생산할 수 있음을 보여주는 사례다.

그러나 레이스 순위표를 넓게 보면 풍경이 달라진다. DeepSeek-V4 Flash는 SWE-bench Verified 79.0, Multilingual 73.3, Pro 52.6, Terminal-Bench 56.9를 기록하고, Claude Sonnet 4.6은 Verified 79.6, Terminal-Bench 2.0 59.1에 도달한다. M.1은 DeepSeek-V4 Flash 대비 Verified에서 4.4 포인트, Multilingual에서 10.2 포인트, Pro에서 3.4 포인트, Terminal-Bench에서 11.1 포인트 뒤진다. XS.2도 같은 파라미터 급의 Qwen3.6과 비교해 Verified 69.9 대 73.4, Multilingual 57.7 대 67.2, Terminal-Bench 35.7 대 51.5로 체계적으로 열세다. 보고서의 "competitive" 프레이밍은 이 체계적 격차를 부각하지 않는데, 레이스에서 "참가"와 "우승 경쟁"이 같은 의미가 아니라는 점에서 주의가 필요하다.

### 비유가 깨지는 지점 (Limit)

이 자동차 공장 비유는 다섯 지점에서 깨진다.

첫째, 이 공장은 단 한 종류의 테스트 트랙만 보유하고 있다 — agentic coding이라는 서킷뿐이다. 공도 주행(general chat), 산악 코스(safety evaluation), 충돌 시험(alignment test), 일반 추론 코스는 단 한 번도 시험되지 않았다. 레이싱카가 서킷에서 좋은 랩 타임을 내도 일반 도로에서 안전한지는 별개의 문제이며, 이 보고서는 서킷 밖의 성능에 대해 침묵한다.

둘째, "competitive"라는 표현이 순위표의 실상을 가린다. M.1은 SWE-bench Verified에서 DeepSeek-V4 Flash 대비 4.4 포인트, Claude Sonnet 4.6 대비 5.0 포인트 뒤지고, Terminal-Bench에서는 DeepSeek 대비 11.1 포인트, Claude 대비 13.3 포인트 차이가 난다. XS.2와 Qwen3.6의 격차는 Terminal-Bench에서 15.8 포인트에 달한다. 이 체계적 열세를 "경쟁력 있다"로 프레이밍하는 것은 비유로 치면 4위 완주를 "포디움 경쟁"이라 부르는 것과 같다.

셋째, 이 공장의 모든 랩 타임 측정은 내부 계측 시스템(pool harness)에서 수행되었다. 외부 독립 계측이 없다. 같은 SWE-bench Verified라도 harness 구현에 따라 점수가 수 포인트씩 달라질 수 있으며, 이 결과를 외부에서 재현할 방법이 제공되지 않는다. 비유하면, 공장 자체 타이밍 시스템으로 잰 기록을 FIA 공인 없이 발표하는 것이다.

넷째, 연료 시험실(AutoMixer)에서 발견된 commonsense regression — ARC-C -6.8%, WinoGrande -1.4% — 이 mid-training과 SFT와 RL을 거친 최종 차량에서 어떻게 됐는지 추적되지 않았다. 연료 배합 단계의 결함이 최종 제품까지 전파됐는지, 아니면 후속 공정에서 상쇄됐는지를 모른다. 비유로 치면, 시험 엔진에서 발견된 연비 결함이 양산차에서도 남아 있는지 확인하지 않고 출하한 셈이다.

다섯째, 벤치마크 조작(benchmark hacking) 발견과 패치가 전적으로 자체 시행되었다. 트랙의 타이밍 센서가 조작되어 있었다는 발견은 중요하지만, 그 패치를 적용하고 탐지기를 만든 주체가 레이스 참가자 자신이다. 외부 기관의 감사나 독립적 검증 없이 자체 패치를 적용한 뒤 자체 계측으로 결과를 보고하는 구조는, 비유의 범위 안에서도 이해 충돌(conflict of interest)이 명백하다.
