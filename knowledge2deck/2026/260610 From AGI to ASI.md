[From AGI to ASI](https://arxiv.org/abs/2606.12683)

Tim Genewein, Matija Franklin, Alexander Lerchner, Laurent Orseau, Samuel Albanie, Adam Bales, Cole Wyeth, Stephanie Chan, Iason Gabriel, Joel Z. Leibo, Allan Dafoe, Marcus Hutter, Thore Graepel, Shane Legg (Google DeepMind)

> Over the last decade, building human-level artificial general intelligence has moved from far-fetched speculation to being a concrete next-decade target for many of the largest AI organisations. Achieving this goal would have profound and far-reaching impacts on human society, which raises many complex questions for the decade ahead. This report investigates how AI itself might continue to develop in a post-AGI world along the continuum of machine intelligence. The endpoint of this continuum, Universal AI, is theoretically well understood, which provides some formal grounding for the main focus of this report: the transition from human-level AGI to artificial general superintelligence, which, intuitively, can be understood as a system that is more intelligent and cognitively capable than large organisations of humans. After characterizing ASI, the report discusses four potential pathways from AGI to ASI: scaling AGI, AI paradigm shifts, recursive improvement, and ASI emerging from large-scale multi-agent collectives. The report then discusses possible frictions and bottlenecks along these pathways. Determining whether the impact of these frictions will be negligible or substantial raises a number of concrete open research questions. Due to large uncertainties for predicting ASI progress, it cannot be ruled out that AI progress might continue to accelerate over the next years. This could imply that the image of a single transformative step change, caused by the introduction of human-level AGI into our society, could be inaccurate. More apt might be the prospect of a series of transformative societal changes caused by AI-enabled progress and breakthroughs across many areas of science and technology. Preparing for this prospect requires a massively interdisciplinary endeavour of global scope and interest.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 자기수리 우주탐사선 (self-upgrading spacecraft) -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

심우주를 항해하는 탐사선이 있다고 상상해보자. 목적지는 알려져 있다 — Universal AI(AIXI)라는 이론적 종착점, 즉 모든 computable 환경에서 최적 누적 보상을 달성하는 agent. 하지만 목적지까지 가는 경로, 소요 시간, 심지어 현재 속도가 목적지에 닿기에 충분한지조차 불분명하다. 지난 10년 동안 탐사선은 매년 약 10배씩 가속해왔다 — 엔진 출력 개선(hardware ~1.5×), 연료 공급 확대(investment ~2.5×), 항법 소프트웨어 효율화(algorithmic efficiency ~3–6×)가 곱해진 결과다. 이 가속이 5년 더 이어지면 유효 compute는 지금보다 약 10,000배 커진다. 문제는 탐사선이 현재 "인간 수준의 AGI" 궤도 어딘가에 막 진입했다고 가정할 때, 그 너머 ASI — 수만 명의 조율된 전문가 집단을 전 인지 영역에서 능가하는 시스템 — 까지의 항로를 어떻게 설계하느냐다. 연료가 바닥날 수도 있고, 엔진 패러다임 자체가 한계에 도달할 수도 있으며, 탐사선이 스스로 자신을 재설계하는 피드백 루프가 작동할 수도 있다.

### 어떻게 푸는가 (Method)

이 보고서는 탐사선이 ASI 궤도에 도달할 수 있는 네 가지 추진 전략을 분석한다.

첫째, **스케일링 추진(scaling pathway)**: 현재 엔진 — transformer 기반 large language model — 의 출력을 compute, 모델 크기, 데이터 양에서 계속 키우는 방식이다. Power-law scaling 관계가 유지되는 한 탐사선은 계속 가속한다.

둘째, **패러다임 전환 추진(paradigm shift pathway)**: 기존 화학 연료 엔진을 이온 추진 혹은 핵 추진으로 교체하듯, transformer를 넘어서는 완전히 새로운 architecture나 optimization 절차로 도약하는 방식이다. 정의상 예측이 "거의 불가능"하지만 역사적으로 가장 큰 도약을 만들어온 경로다.

셋째, **자기수리·자기개선 추진(recursive self-improvement pathway)**: 탐사선이 비행 중에 스스로 엔진을 재설계하고 교체하는 방식이다. Genotypic(weight update), memetic(알고리즘·아키텍처 개선), sociogenic(사회적 제도 개선), cooperative(human–AI 협력) 네 가지 하위 메커니즘이 있다. 이 루프가 작동하면 가속이 지수적(exponential)에서 쌍곡적(hyperbolic)으로 바뀔 수 있다 — 성장률 자체가 시간에 따라 증가하는 "intelligence explosion."

넷째, **다중 탐사선 집단 추진(multi-agent collective pathway)**: 수천 개의 AGI 탐사선이 고대역폭 통신망으로 조율되며 단일 탐사선으로는 불가능한 분산 인지 능력을 발휘하는 방식이다.

여섯 가지 잠재적 항로 장애물(bottleneck)도 명시된다: 데이터 고갈(data wall — 고품질 텍스트는 이 10년 내 소진 전망), 자원·경제적 제약, 신경망 패러다임의 근본적 한계, 연구 난이도 증가, 추상화 장벽, 의도적 감속(deliberate slowdown by regulation or safety concerns). 각 장애물에는 대응하는 완화 요인도 제시된다 — synthetic data와 self-play, AI 주도 효율 개선, 경쟁·군사적 압력 등.

이 보고서의 방법론적 기반은 AIXI와 Legg-Hutter intelligence measure다. AIXI는 Solomonoff universal prior 하에서 모든 computable 환경에서 최적 누적 보상을 달성함을 증명할 수 있어, 지능 continuum의 이론적 상한을 제공한다. 현재의 대규모 pretraining이 universal compression에 근접하고 있다는 최근 연구 결과도 이 연결고리를 강화한다.

### 무엇을 얻었나 (Result)

이 보고서는 실험 결과가 아니라 분석 프레임워크와 정량적 기준점을 산출물로 제공한다. 핵심 수치들은 다음과 같다.

유효 compute 성장률은 연간 ~10×이며, hardware 1.5×, investment 2.5×, algorithmic efficiency 3–6× 세 인수의 곱이다. 이 속도가 유지되면 5년 후 유효 compute는 현재의 ~10,000배가 된다. 탐사선의 현재 가속도를 측정한 셈이다.

디지털 지능이 생물학적 지능에 대해 가지는 구조적 우위 7가지 — 입출력 속도, 내부 처리 속도, working memory 용량, substrate 독립성, 무손실 복제, 고대역폭 경험 공유, 시간적 유연성 — 가 Table 1로 정리된다. 이 우위들은 compute가 강해질수록 더 커진다.

타임라인 전망은 의도적으로 비확정적이다: ASI 도달은 "몇 달에서 수십 년" 사이로만 기술된다. 지수적·쌍곡적 성장 하에서 불확실성 구간이 급속히 확장되기 때문에 평균값 예측 자체가 "의사결정에 별로 도움이 되지 않는다"고 명시된다. 보고서의 실질적 기여는 단일 예측이 아니라, 연구자들이 자신의 연구를 이 taxonomy 위에서 위치시킬 수 있는 좌표계다.

### 비유가 깨지는 지점 (Limit)

자기수리 탐사선 비유는 몇 가지 지점에서 실제 문제의 복잡성을 과소대표한다.

첫째, 탐사선은 자신의 물리 법칙을 바꿀 수 없다. 그러나 recursive self-improvement에서는 바로 그 "물리 법칙" — 최적화 알고리즘, 아키텍처의 귀납적 편향 — 이 수정 대상이 된다. 이 루프가 실제로 지속 가능한지, 얼마나 빠르게 작동하는지는 "역사적 선례가 없고 이론적으로도 빈약하게 이해된다"고 보고서 자신이 인정한다.

둘째, AIXI라는 목적지는 incomputable하다 — 어떤 물리적 하드웨어로도 실제로 구현할 수 없다. 실용적 ASI는 AIXI에 도달하기 훨씬 전에 구현될 수 있지만, 그렇다면 목적지가 어디인지는 여전히 불명확하다. 보고서는 이 "이론과 실천 사이의 상당한 간극"을 솔직하게 인정한다.

셋째, 패러다임 전환은 정의상 예측 불가능하다. 보고서는 이 경로를 분석하면서도 "완전히 새로운 아키텍처나 최적화 절차를 예상하는 것은 거의 불가능하다"고 명시한다. 즉, 네 가지 경로 중 가장 강력할 수 있는 경로가 분석 프레임워크 자체의 사각지대에 있다.

넷째, 다중 탐사선 집단에서 창발하는 집단 지성은 "복잡한 동역학 시스템의 창발로서 빈약하게 이해된다." 개별 탐사선의 성능과 집단의 인지 능력 사이의 scaling law는 아직 존재하지 않는다.

다섯째, 비유가 완전히 가리는 차원: 인간 사회가 어떻게 ASI와 공존하거나 번영할 것인가의 문제는 "이 보고서의 범위를 벗어난다"고 명시적으로 제외된다. 탐사선이 목적지에 도달한 후 지구에 무슨 일이 일어나는지는 다루지 않는다.
