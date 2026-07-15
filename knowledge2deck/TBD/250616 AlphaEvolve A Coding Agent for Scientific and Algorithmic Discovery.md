[AlphaEvolve: A coding agent for scientific and algorithmic discovery](https://arxiv.org/abs/2506.13131)

Alexander Novikov, Ngân Vũ, Marvin Eisenberger, Emilien Dupont, Po-Sen Huang, Adam Zsolt Wagner, Sergey Shirobokov, Borislav Kozlovskii, Francisco J. R. Ruiz, Abbas Mehrabian, M. Pawan Kumar, Abigail See, Swarat Chaudhuri, George Holland, Alex Davies, Sebastian Nowozin, Pushmeet Kohli, Matej Balog (Google DeepMind)

> In this white paper, we present AlphaEvolve, an evolutionary coding agent that substantially enhances capabilities of state-of-the-art LLMs on highly challenging tasks such as tackling open scientific problems or optimizing critical pieces of computational infrastructure. AlphaEvolve orchestrates an autonomous pipeline of LLMs, whose task is to improve an algorithm by making direct changes to the code. Using an evolutionary approach, continuously receiving feedback from one or more evaluators, AlphaEvolve iteratively improves the algorithm, potentially leading to new scientific and practical discoveries. We demonstrate the broad applicability of this approach by applying it to a number of important computational problems. When applied to optimizing critical components of large-scale computational stacks at Google, AlphaEvolve developed a more efficient scheduling algorithm for data centers, found a functionally equivalent simplification in the circuit design of hardware accelerators, and accelerated the training of the LLM underpinning AlphaEvolve itself. Furthermore, AlphaEvolve discovered novel, provably correct algorithms that surpass state-of-the-art solutions on a spectrum of problems in mathematics and computer science, significantly expanding the scope of prior automated discovery methods (Romera-Paredes et al., 2023). Notably, AlphaEvolve developed a search algorithm that found a procedure to multiply two 4 × 4 complex-valued matrices using 48 scalar multiplications; offering the first improvement, after 56 years, over Strassen's algorithm in this setting. We believe AlphaEvolve and coding agents like it can have a significant impact in improving solutions of problems across many areas of science and computation.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 끊임없이 개량되는 주방 레시피 -->

## 비유로 풀어보기

AlphaEvolve를 **하나의 거대한 주방**으로 보자. 이 주방의 목표는 어떤 "요리(algorithm)"를 만들 수 있는 가장 효율적인 레시피를 찾아내는 것이다. 레시피는 곧 코드이고, 셰프는 LLM이며, 손님 대신 **객관적인 미각 측정기(automated evaluator)**가 모든 접시에 점수를 매긴다.

### 풀려는 문제 (Problem)

좋은 레시피를 찾는 일은 원래 오랜 시행착오가 필요하다. 재료를 줄여보고, 순서를 바꿔보고, 실패하면 되돌아가고 — 새로운 과학적 발견이나 상업적으로 가치 있는 알고리즘을 만드는 과정이 딱 이렇다. 최근에는 LLM이라는 "천재 셰프"가 등장해서 이 과정을 자동화하려 하지만, 천재 셰프 한 명에게 "최고의 요리를 한 번에 써내라"고 하면 그럴듯하지만 실제로는 맛없는 레시피, 즉 **그럴듯한 hallucination**을 내놓기 일쑤다.

핵심 난점은 두 가지다. 첫째, 레시피의 경우의 수가 천문학적이라 한 번의 영감으로는 최적에 닿지 못한다. 둘째, 셰프의 말만 믿으면 안 된다 — **실제로 맛을 봐서 더 나아졌음이 검증된 레시피만** 남겨야 한다. 그래서 이 주방은 "정답을 기계가 채점할 수 있는 요리"만 다룬다. 수학·컴퓨터과학·시스템 최적화처럼 점수를 자동으로 매길 수 있는 분야가 메뉴판에 오른다.

### 어떻게 푸는가 (Method)

이 주방은 한 명의 셰프가 아니라 **진화(evolution) 방식의 공방**으로 돌아간다.

- **레시피 북(program database):** 지금까지 검증된 레시피들이 보관된다. 매 라운드 여기서 부모 레시피 하나와 영감용 레시피 몇 개를 꺼낸다.
- **주문서 작성(prompt sampler):** 꺼낸 레시피들과 "이런 식으로 고쳐봐"라는 지침, 과거 시도·점수를 묶어 긴 주문서를 만든다. 사람이 쓴 설명·논문·수식도 함께 끼워 넣을 수 있다(rich context).
- **셰프 군단(LLMs ensemble):** SOTA LLM 여러 대가 주문서를 받아 레시피를 **통째 수정(diff)** 한다. [[231214 Mathematical Discoveries from Program Search with Large Language Models|FunSearch]] 시절엔 셰프가 레시피 한 단락(single function, 10~20줄)만 손댈 수 있었지만, AlphaEvolve의 셰프는 **레시피 파일 전체, 수백 줄, 어떤 언어든** 고친다.
- **미각 측정기(evaluators):** 고쳐진 레시피로 만든 접시를 실제로 조리·실행해 점수를 매긴다. 여기서 거짓말은 통하지 않는다 — 코드 실행과 자동 채점이 셰프의 환각을 걸러낸다(grounding). 여러 지표를 동시에 채점할 수도 있다.
- 점수가 더 좋은 레시피만 레시피 북에 다시 꽂히고, 다음 라운드의 부모가 된다.

수정할 부분은 레시피 위에 `# EVOLVE-BLOCK-START` / `# EVOLVE-BLOCK-END` 라는 **"여기만 고쳐도 됨" 포스트잇**으로 표시한다. 나머지 골격은 그대로 두고 끼워진 부품만 진화시킨다. 덕분에 millions 단위 샘플이 필요했던 FunSearch와 달리 thousands 수준의 LLM 샘플로도 충분하다. 다만 R4 비판대로, 이 모든 게 성립하려면 **미각 측정기가 반드시 기계여야 한다**는 전제가 깔린다.

### 무엇을 얻었나 (Result)

검증된 레시피로 차린 접시들의 성적:

- **4×4 복소 행렬곱 요리:** Strassen(1969) 레시피를 재귀로 적용하면 스칼라 곱 **49번**이 필요했다. Fawzi et al.은 원소가 2개인 특수한 체에서만 **47번** 레시피를 찾았을 뿐이다. AlphaEvolve는 characteristic 0 위에서 49보다 적은 레시피를 찾는 **56년 묵은 난제**를 풀어, 두 4×4 복소 행렬을 **48번**의 스칼라 곱으로 곱하는 레시피를 처음으로 내놓았다. 행렬곱 알고리즘 **14종**의 SOTA를 함께 끌어올렸다.
- **수학 50문제 이상의 메뉴:** 5개 이상의 수학 분야에 적용해 **75%**에서 기존 최고 구성을 재현했고, **20%**에서는 기존보다 더 나은 새 구성을 찾아 SOTA를 갱신했다. 11차원 kissing number를 종전 **592**개에서 **593**개로 올렸고, Erdős의 minimum overlap problem 상한도 갱신했다.
- **Google 주방(인프라) 절약:** 데이터센터 스케줄링(Borg) 레시피를 갈아 fleet 전체 컴퓨트 자원의 평균 **0.7%**를 회수했다(원래는 stranded 됐을 자원). Gemini 학습용 행렬곱 커널 타일링 휴리스틱으로 커널 평균 **23%** 가속, Gemini 전체 학습 시간 **1%** 단축. 커널 최적화에 들던 수개월의 엔지니어링을 며칠로 줄였다.
- **컴파일러 생성 코드:** XLA가 만든 FlashAttention 커널을 **32%** 가속, 전후처리(pre/postprocessing)를 **15%** 추가 가속했다. TPU 산술 회로의 Verilog/RTL에서 불필요한 비트를 제거하는 재작성도 찾아냈고, 이는 TPU 설계자들이 정확성을 검증했다.

### 비유가 깨지는 지점 (Limit)

주방 비유는 "맛있다/없다"를 **기계가 정확히 채점할 수 있을 때만** 성립한다. 이게 곧 논문이 인정한 가장 큰 한계다 — 자동 평가 지표를 만들 수 없는 문제, 즉 사람이 직접 실험해야 가치를 알 수 있는 영역은 메뉴판에서 통째로 빠진다. 비유 속 "미각 측정기"는 만능 손님이 아니라 좁은 자동 채점기일 뿐이다.

또한 이 주방의 절약 수치 상당수가 **Google 사내 주방에서만 측정된 값**이다. 0.7% fleet 회수, 23% 커널 가속, FlashAttention 32%, Gemini 1% 학습 단축 같은 숫자는 외부에서 같은 재료(워크로드·하드웨어)로 다시 맛볼 수 없다. 본 문서는 peer-review를 거친 논문이 아니라 white paper라는 점도 함께 감안해야 한다.

비유가 가리는 또 하나는 **개선의 폭**이다. kissing number 592→593, 여러 해석학·기하 문제의 소수점 셋째~넷째 자리 갱신처럼, 일부 결과는 "재료 한 알 줄인" 수준의 marginal 개선이다. 비유는 "더 나은 레시피"라고 뭉뚱그리지만 실제 게인의 크기는 문제마다 천차만별이다.

마지막으로, 비유는 셰프 군단이 "공짜로 무한히 시도한다"는 인상을 주지만, 현실에서는 SOTA LLM thousands 샘플과 — 수학이 아닌 인프라 과제의 경우 — 가속기 위에서 수 시간이 걸리는 평가가 라운드마다 든다. 빠른 자동 평가가 불가능하면 이 진화 루프 자체가 비싸지거나 작동하지 않는다.
