[Mathematical discoveries from program search with large language models](https://www.nature.com/articles/s41586-023-06924-6)

Bernardino Romera-Paredes, Mohammadamin Barekatain, Alexander Novikov, Matej Balog, M. Pawan Kumar, Emilien Dupont, Francisco J. R. Ruiz, Jordan S. Ellenberg (University of Wisconsin–Madison), Pengming Wang, Omar Fawzi (Inria, ENS de Lyon), Pushmeet Kohli, Alhussein Fawzi (이외 전원 Google DeepMind)

> Large language models (LLMs) have demonstrated tremendous capabilities in solving complex tasks, from quantitative reasoning to understanding natural language. However, LLMs sometimes suffer from confabulations (or hallucinations), which can result in them making plausible but incorrect statements. This hinders the use of current large models in scientific discovery. Here we introduce FunSearch (short for searching in the function space), an evolutionary procedure based on pairing a pretrained LLM with a systematic evaluator. We demonstrate the effectiveness of this approach to surpass the best-known results in important problems, pushing the boundary of existing LLM-based approaches. Applying FunSearch to a central problem in extremal combinatorics—the cap set problem—we discover new constructions of large cap sets going beyond the best-known ones, both in finite dimensional and asymptotic cases. This shows that it is possible to make discoveries for established open problems using LLMs. We showcase the generality of FunSearch by applying it to an algorithmic problem, online bin packing, finding new heuristics that improve on widely used baselines. In contrast to most computer search approaches, FunSearch searches for programs that describe how to solve a problem, rather than what the solution is. Beyond being an effective and scalable strategy, discovered programs tend to be more interpretable than raw solutions, enabling feedback loops between domain experts and FunSearch, and the deployment of such programs in real-world applications.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 씨앗 육종 정원 -->

## 비유로 풀어보기

FunSearch를 **품종 개량을 하는 정원**으로 보자. 정원사는 LLM이고, 정원사가 심는 것은 완성된 식물이 아니라 **"이렇게 키워라"라고 적힌 재배 지침 카드(a single function)** 한 장이다. 수확물의 크기를 객관적으로 재는 **심판(evaluator)**이 모든 카드를 채점한다. (이 정원은 훗날 [[250616 AlphaEvolve A Coding Agent for Scientific and Algorithmic Discovery|AlphaEvolve]]라는 더 큰 온실로 확장된다.)

### 풀려는 문제 (Problem)

LLM은 양자 추론부터 자연어 이해까지 놀라운 능력을 보이지만, 가끔 **confabulation(hallucination)** 에 빠져 그럴듯하지만 틀린 말을 한다. 정원에 비유하면, 천재 정원사에게 "최고의 식물을 묘사해봐"라고 하면 말은 번지르르하지만 실제로 심으면 싹도 안 나는 **씨앗**을 내놓는 격이다. 이 때문에 LLM을 그대로 과학적 발견에 쓰기는 어려웠다.

문제는 이것이다 — 어떻게 정원사의 창의성은 살리되, **실제로 자라는 것이 검증된 카드만** 남길 것인가? 그리고 발견의 대상을 "완성된 식물(정답, what)"이 아니라 **"재배 지침(프로그램, how)"** 으로 바꾸면 더 잘 풀리지 않을까?

### 어떻게 푸는가 (Method)

FunSearch는 세 부품이 맞물린 **진화 루프(evolutionary procedure)** 다.

- **정원사(pretrained LLM):** Google의 PaLM 2를 쓴다(코드로 학습된 다른 LLM도 호환). 정원사는 기존 카드들을 보고 새 재배 지침 카드를 창의적으로 써낸다.
- **심판(systematic evaluator):** 카드대로 실제로 식물을 키워(코드 실행) 수확물을 채점한다. 싹이 안 트는 카드, 즉 정원사의 환각은 여기서 즉시 걸러진다. 이 grounding이 FunSearch의 핵심 안전장치다.
- **씨앗 상자(programs database):** 점수 높은 카드들을 보관하고, 다음 라운드에 정원사에게 영감용으로 다시 꺼내준다. 좋은 카드끼리 교배(crossover)되며 세대를 거듭한다.

결정적 차이는 정원사가 **식물 자체가 아니라 "기르는 법"을 진화시킨다**는 점이다 — 대부분의 컴퓨터 탐색이 "정답이 무엇인가(what)"를 직접 찾는 것과 반대로, FunSearch는 "어떻게 만드는가(how)를 적은 프로그램"을 찾는다. 그 결과 우승 카드는 짧고 읽을 수 있는 글(low Kolmogorov complexity)이라, 전문가가 *왜* 통하는지 이해하고 피드백할 수 있다.

다만 이 정원의 카드는 한 장짜리다 — 단일 함수(약 10~20줄)만, Python으로만 고친다. 후속작 AlphaEvolve의 Table 1 기준으로 보면, FunSearch는 millions 단위의 씨앗(LLM 샘플)을 뿌려야 하고 각 카드 채점은 1 CPU에서 20분 이내(≤20min)로 빨라야 하며, 작은 LLM을 쓰고 단일 지표만 최적화한다.

### 무엇을 얻었나 (Result)

검증된 카드가 길러낸 수확:

- **Cap set 문제(extremal combinatorics):** 기존 최고를 넘어서는 새로운 큰 cap set 구성을 finite dimensional·asymptotic 양쪽에서 발견했다. DeepMind는 이를 **지난 20년간 cap set 크기의 가장 큰 증가**라고 설명한다. LLM으로 established open problem에서 실제 발견이 가능함을 처음으로 보였다.
- **Online bin packing(알고리즘 문제):** 새 휴리스틱 카드를 길러, 널리 쓰이는 baseline(first-fit·best-fit류)보다 **같은 물건을 더 적은 통(fewer bins)에 담는** 규칙을 찾아냈다.
- **해석 가능성:** 우승 카드가 raw solution이 아니라 읽을 수 있는 프로그램이라, 도메인 전문가와 FunSearch 사이의 feedback loop와 실제 배포가 가능했다. (2024년 12월 업데이트에서 정원사는 Gemini 1.5 Flash로 교체됐다.)

### 비유가 깨지는 지점 (Limit)

정원 비유는 **심판이 수확물을 빠르고 객관적으로 잴 수 있을 때만** 성립한다. cap set·bin packing처럼 답을 기계가 자동 채점할 수 있는 문제라야 루프가 돈다 — 사람이 직접 평가해야 하는 영역은 이 정원의 메뉴에 없다. 비유 속 "심판"은 만능 평가자가 아니라 좁은 자동 채점기다.

또 비유는 "카드 한 장"의 제약을 가볍게 보이게 한다. FunSearch는 **단일 함수**만 진화시키므로, 여러 함수·수백 줄에 걸친 복잡한 알고리즘은 다루지 못한다. 바로 이 한계를 후속작 AlphaEvolve가 "온실 전체(전체 코드 파일) 진화"로 풀어낸다 — 즉 이 논문의 가장 큰 약점은 스스로의 후속 연구가 메운 셈이다.

마지막으로, 정원 비유는 "씨앗을 무한정 뿌린다"는 인상을 주지만 현실에서는 millions 단위 LLM 샘플과 빠른 채점(≤20min/1 CPU)이 전제다. 채점이 느리거나 자동화되지 않으면 이 진화 루프 자체가 성립하지 않는다. 더불어 cap set·bin packing의 개선은 기록적이긴 해도 여전히 **점진적 구성(incremental construction)** 수준이며, 비유의 "역대급 수확"이라는 표현이 게인의 실제 크기를 과장할 수 있다.
