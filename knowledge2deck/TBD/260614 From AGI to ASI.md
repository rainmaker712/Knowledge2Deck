[From AGI to ASI](https://arxiv.org/abs/2606.12683)

Tim Genewein, Matija Franklin, Alexander Lerchner, Laurent Orseau, Samuel Albanie, Adam Bales, Cole Wyeth, Stephanie Chan, Iason Gabriel, Joel Z. Leibo, Allan Dafoe, Marcus Hutter, Thore Graepel, Shane Legg (Google DeepMind)

> Over the last decade, building human-level artificial general intelligence has moved from far-fetched speculation to being a concrete next-decade target for many of the largest AI organisations. Achieving this goal would have profound and far-reaching impacts on human society, which raises many complex questions for the decade ahead. This report investigates how AI itself might continue to develop in a post-AGI world along the continuum of machine intelligence. The endpoint of this continuum, Universal AI, is theoretically well understood, which provides some formal grounding for the main focus of this report: the transition from human-level AGI to artificial general superintelligence, which, intuitively, can be understood as a system that is more intelligent and cognitively capable than large organisations of humans. After characterizing ASI, the report discusses four potential pathways from AGI to ASI: scaling AGI, AI paradigm shifts, recursive improvement, and ASI emerging from large-scale multi-agent collectives. The report then discusses possible frictions and bottlenecks along these pathways. Determining whether the impact of these frictions will be negligible or substantial raises a number of concrete open research questions. Due to large uncertainties for predicting ASI progress, it cannot be ruled out that AI progress might continue to accelerate over the next years. This could imply that the image of a single transformative step change, caused by the introduction of human-level AGI into our society, could be inaccurate. More apt might be the prospect of a series of transformative societal changes caused by AI-enabled progress and breakthroughs across many areas of science and technology. Preparing for this prospect requires a massively interdisciplinary endeavour of global scope and interest.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 눈덩이 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

가파른 설산 꼭대기에 눈덩이 하나가 있다. 지금까지 인류는 그 눈덩이가 얼마나 빠르게, 얼마나 커지면서 굴러 내려갈지 예측하는 데 실패해왔다. 눈덩이(AI)가 아직 산 중턱에 있을 때 — 즉 AGI 수준, 평균적인 인간 한 명 정도의 인지 능력을 갖췄을 때 — 우리는 이미 그 무게와 속도가 인상적이라는 것을 안다. 그런데 진짜 질문은 다르다. 중턱 아래에 무엇이 있는가? 눈덩이가 ASI 수준 — 대규모 전문가 집단 전체를 능가하는 수준 — 으로 성장하는 경로가 몇 가지나 있고, 각 경로를 막는 장애물이 일시적인 돌멩이인지 영구적인 절벽인지, 그리고 이 눈덩이가 커질수록 *스스로 경사를 깎아서 더 빠르게 굴러갈 수 있는지* 우리는 모른다.

이 보고서가 답하려는 것은 바로 그 질문이다. AGI라는 중턱을 통과한 이후의 지형도 — 경로, 병목, 그리고 이론적 종착지인 Universal AI(AIXI) — 를 형식적으로 그려내는 것. 산의 물리법칙(빛의 속도, Landauer 원리, Gödel 불완전성)은 눈덩이가 아무리 커져도 넘을 수 없는 지형의 절대 한계다. 그 한계 안에서 눈덩이는 얼마나 커질 수 있는가?

### 어떻게 푸는가 (Method)

보고서는 실험을 돌리지 않는다. 대신 눈덩이가 ASI에 도달할 수 있는 **네 가지 경로**와 그 경로를 막는 **일곱 가지 병목**을 체계적으로 분석하는 지형 감사 보고서다.

**경로 1 — 눈이 쌓이는 양 자체를 늘린다 (Scaling):** 눈덩이는 굴러가며 눈을 흡수한다. Effective compute는 역사적으로 연간 ~10배씩 성장해왔다 — 하드웨어 효율 ×1.5, 투자 규모 ×2.5, 알고리즘 효율 ×3, 이 세 요소의 곱이 1.5×2.5×3=11.25이고 보고서는 이를 "보수적으로 ~10배"로 표기한다. 경사가 일정하고 눈이 계속 충분히 쌓인다면 이 경로가 가장 예측 가능하다. 그러나 고품질 텍스트 데이터는 "이번 10년 안에" 소진될 것으로 추정되며, 이것이 눈 공급의 물리적 한계다.

**경로 2 — 경사면의 재질을 바꾼다 (Paradigm shift):** Transformer 이후, 미끄럼 저항이 다른 새로운 재질의 경사면이 등장한다면 — 신경형 하드웨어, RL 기반 pretraining, 명시적 world model, 선형 시간 sequence architecture — 같은 눈덩이라도 훨씬 빠르게 굴러갈 수 있다. 이런 전환은 사전 예측이 거의 불가능하고, 일어나고 나서야 "그것이 패러다임 전환이었다"는 게 보인다.

**경로 3 — 눈덩이가 스스로 앞의 경사를 깎는다 (Recursive self-improvement, RSI):** 이 경로가 보고서에서 가장 이론적으로 흥미롭다. 눈덩이가 단순히 눈을 흡수하는 데서 그치지 않고, 구르면서 *자기 앞의 경사를 더 가파르게 깎아* 가속을 높이는 경우다. 보고서는 이 자기-깎기를 네 층위로 구분한다.

- **Genotypic RSI**: 눈덩이의 밀도 구조 자체를 재설계한다 — 모델 weights, architecture, 코드의 직접 수정. Neural architecture search, FunSearch, AlphaEvolve가 초기 사례다.
- **Memetic RSI**: 눈덩이가 굴러가며 남기는 자국(학습 데이터, 합성 데이터, distillation 결과)이 다음 눈덩이의 경사를 다듬는다. 인간의 문화적 진화에 해당하지만 속도가 수천 배 빠를 수 있다.
- **Sociogenic RSI**: 여러 눈덩이가 분업하며 각자 다른 경사 구간을 깎는다 — AI가 AI 연구를 수행하는 문명 단위 루프.
- **Hardware RSI**: 눈덩이가 더 날카로운 깎기 도구(차세대 칩)를 직접 설계한다.

네 층위가 동시에 작동하면 성장은 exponential을 넘어 hyperbolic에 근접한다. Hyperbolic 성장은 유한한 시간 안에 이론적으로 무한대를 향한다 — 눈덩이가 너무 빠르게 커지면 3일 후의 상태를 오늘의 관측으로 예측할 수 없다는 뜻이다.

**경로 4 — 수많은 눈덩이가 합쳐져 눈사태가 된다 (Multi-agent collectives):** 단일 눈덩이가 아니라 수천, 수백만 개의 agent가 병렬로 굴러가며 상호작용할 때, 집단 지능은 개별 눈덩이의 합을 초과한다. 보고서는 두 가지 조정 방식을 구분한다 — 가격 신호로 조율되는 분산 시장형과, 고대역폭으로 내부 표현을 공유하는 중앙집중형. 집단 능력은 agent 수와 상호작용 밀도에 따라 scaling된다.

**핵심 병목 세 가지:** Data wall(고품질 텍스트 고갈), Abstraction barrier(인간 추상화를 학습한 AI가 원시 데이터로부터 새로운 개념을 형성할 수 있는가의 문제), Deliberate slowdown(규제·거버넌스라는 외부 제동).

### 무엇을 얻었나 (Result)

보고서가 제공하는 것은 실험 결과가 아니라 **지형도**다. 어느 경로도 ASI를 보장하지 않지만, 이들의 조합이 계속 진행된다면 ASI는 "진지한 장기 계획 지평선"이다.

핵심 수치들을 비유 안에서 정리하면 다음과 같다. Effective compute는 역사적으로 10배/년 증가해왔고(하드웨어 ×1.5, 투자 ×2.5, 알고리즘 ×3의 곱), 가장 큰 ML training run은 지난 10년간 연간 4배씩 성장했다. 이 속도가 10년 말까지 유지된다면 오늘 대비 **10,000배**의 effective compute가 쌓인다. AGI 인스턴스 자체도 scaling된다 — 초기 비용이 높아 1,000개만 운용 가능하더라도, 1년 후에는 10,000개, 5년 후에는 1억 개 또는 100배 빠른 100만 개가 된다.

물리적 한계는 세 개의 절벽으로 명시된다. 첫째, 빛의 속도 — 분산 눈사태의 통신 지연 하한. 둘째, Gödel 불완전성 — 형식 체계 안에 항상 참이지만 증명 불가능한 명제가 존재한다. 이는 지능의 크기와 무관하게 초월되지 않는 논리적 절벽이다. 셋째, P≠NP (conjecture) — NP-hard 문제에 대해 다항 시간 해법이 없다면 지능이 아무리 높아도 지수적 탐색이 필요한 문제는 사라지지 않는다.

Universal AI(AIXI)는 Legg-Hutter 지능 측도 상의 이론적 종착지다. 모든 계산 가능한 환경에서 Solomonoff universal prior로 가중된 기대 누적 보상을 최대화하는 agent다. 수학적으로 우아하지만 계산 불가능(incomputable)하다 — 눈사태의 이론적 최대 크기는 정의되어 있지만 현실에서 도달하거나 측정할 수 없다.

### 비유가 깨지는 지점 (Limit)

눈덩이 비유는 네 지점에서 누설된다.

**첫째, 눈덩이는 경사를 깎지 못한다.** Genotypic RSI — 모델이 자기 weights를 직접 수정하는 것 — 는 눈덩이가 물리적으로 경사를 조각하는 것이 아니라, 눈덩이의 *밀도 공식 자체*가 바뀌는 것이다. 비유가 포착하는 "앞을 깎는다"는 이미지는 외부 환경 조작이지, 시스템 내부 구조의 자기-변형이 아니다. 이 차이가 중요한 이유는 genotypic RSI가 갖는 지수적 가속의 출처가 비유에서 보이지 않기 때문이다.

**둘째, 눈사태는 분업하지 않는다.** Sociogenic RSI와 multi-agent collectives의 핵심은 *전문화된 분업* — 서로 다른 인지 역할을 맡은 agent들이 고대역폭으로 협력하는 것이다. 눈사태 안의 눈덩이들은 서로 역할이 없다. 집단이 단순 병렬이 아니라 이질적 전문화에 의해 개별 합을 초과한다는 논점이 비유에서 사라진다.

**셋째, Abstraction barrier는 지형 문제가 아니다.** 보고서의 가장 흥미로운 병목 중 하나는 "인간이 생성한 추상화를 학습한 AI가 원시 데이터로부터 *새로운* 개념을 형성할 수 있는가"다. 이것은 경사의 가파름이나 눈의 양으로 해결되지 않는, 눈덩이의 *인식론적 구조* 문제다. 비유는 이 장벽을 "눈이 부족한 구간"으로 납작하게 만든다.

**넷째, 보고서 자체가 측정 도구 없는 지형도다.** R4가 지적한 대로, AIXI는 incomputable이고 Legg-Hutter 측도를 실제 시스템에 적용하는 방법이 없다. 눈덩이가 지금 어디에 있는지, AGI 임계점이 경사의 어느 지점인지 알 수 없다. 이것은 비유의 한계가 아니라 *보고서의 한계*인데, 비유가 그 불확실성을 "지도에 표시된 경사"처럼 확정적으로 보이게 만드는 부작용이 있다.
