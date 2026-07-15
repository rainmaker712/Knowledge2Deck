[Autodata: An Agentic Data Scientist to Create High Quality Synthetic Data](https://arxiv.org/abs/2606.25996)

Ilia Kulikov (FAIR at Meta), Chenxi Whitehouse (FAIR at Meta), Tianhao Wu (FAIR at Meta), Yixin Nie (FAIR at Meta), Swarnadeep Saha (FAIR at Meta), Eryk Helenowski (FAIR at Meta), Weizhe Yuan (FAIR at Meta), Olga Golovneva (FAIR at Meta), Jack Lanchantin (FAIR at Meta), Yoram Bachrach (FAIR at Meta), Jakob Foerster (FAIR at Meta), Xian Li (FAIR at Meta), Han Fang (FAIR at Meta), Sainbayar Sukhbaatar (FAIR at Meta), Jason Weston (FAIR at Meta)

> We introduce Autodata, a general method that enables AI agents to act as data scientists who build high quality training and evaluation data. We show how to train (meta-optimize) such a data scientist agent, so that it learns to create even stronger data. We describe the overall formulation, and a specific practical implementation, Agentic Self-Instruct. We conduct experiments on computer science research tasks, legal reasoning tasks and reasoning with mathematical objects, where we obtain improved results compared to classical synthetic dataset creation methods. Further, meta-optimizing the data scientist agent itself delivers an even larger performance uplift. Agentic data creation provides a way to convert increased inference compute into higher quality model training.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 자기 코칭법까지 개선하는 퍼스널 트레이너의 맞춤 운동 루틴 -->

## 비유로 풀어보기

이 논문은 한 명의 **퍼스널 트레이너**가 회원에게 맞춤 운동 루틴을 짜 주는 헬스장으로 비유할 수 있다. 모델을 학습시킨다는 것은 결국 "회원을 더 강하게 만드는 일"이고, 학습 데이터는 그 회원이 소화할 "운동 루틴"이다. 이 비유의 *진짜 차별점*은 단순히 좋은 운동을 설계하는 데서 그치지 않고 — 트레이너가 **자신의 코칭 방법론 자체를 회원 성과를 보고 다시 고쳐 쓴다**는 점(meta-optimization)이며, 다른 self-improvement 논문들이 "운동 설계"에서 멈추는 것과 여기서 갈린다. 이 비유를 Problem → Method → Result → Limit 네 칸 모두에서 끝까지 끌고 간다.

### 풀려는 문제 (Problem)

회원(LLM)을 더 강하게 만들고 싶은데, 시중에 파는 기성 운동 DVD(웹에서 긁어온 인간 데이터)가 동이 났다. DVD를 더 사 모아도(데이터를 더 스크래핑해도) 효과는 점점 줄어든다 — 이미 쉬운 동작은 다 익혔고, 정작 필요한 것은 회원의 현재 한계 바로 위에 있는 "딱 적당히 어려운" 운동이기 때문이다.

기존 합성 데이터 방식인 Self-Instruct·CoT-Self-Instruct는 "루틴을 새로 찍어내기"는 하지만, 그 루틴이 **얼마나 어려운지·쓸 만한지를 직접 통제하지 못한다**. 운동 카드를 잔뜩 인쇄해도 난이도가 들쭉날쭉이라, 절반은 너무 쉬워 근육이 안 붙고 절반은 너무 어려워 회원이 포기한다. 필요한 것은 카드 인쇄기가 아니라, 회원의 상태를 읽고 난이도를 조준해 주는 **트레이너**다.

### 어떻게 푸는가 (Method)

Autodata는 데이터를 "만드는 사람" 자체를 에이전트로 세운다. 즉 헬스장에 **퍼스널 트레이너(data scientist agent)** 를 고용한다. Agentic Self-Instruct라는 구체적 구현에서 트레이너는 혼자 일하지 않고, 한 명의 총괄(orchestrator) 아래 네 명의 보조 역할이 한 팀으로 움직인다.

![Figure 2 — Agentic Self-Instruct의 weak-vs-strong 구조: orchestrator가 challenger, weak/strong solver, judge를 지휘한다.](assets/260625-autodata-fig2-method.png)

- **Challenger** = 트레이너가 회원의 진료 차트·트레이닝 매뉴얼(source document, 예: CS 논문)을 읽고 운동 한 세트 + 채점표(rubric)를 짜는 역할.
- **Weak solver(초보 회원)** 와 **Strong solver(숙련 회원)** 가 그 루틴을 각각 시도해 본다.
- **Verifier/Judge(채점 코치)** 가 결과를 채점하고 피드백을 준다.

핵심은 합격 기준이 "정답이냐"가 아니라 **"난이도가 딱 맞느냐"** 라는 점이다. 숙련 회원은 해내지만 초보 회원은 아직 못 하는 — 그 **간격(strong-weak gap)** 이 벌어질 때만 루틴을 채택한다. CS 과제에서 이 간격은 agentic 데이터에서 0.314로, CoT baseline의 0.019보다 훨씬 크게 벌어진다. 한 세트를 채택하기까지 트레이너는 평균 6.59회 루틴을 다시 짠다(예시로 든 CS 연구 질문은 넓은 요약에서 구체적 알고리즘 분석 질문으로 six rounds에 걸쳐 날카로워진다).

여기서 R4(Critical) 비판이 들어온다 — 이 "초보는 실패·숙련은 성공" 기준은 **자기참조적**이다. 합격 신호가 외부 정답이 아니라 *이 헬스장 안의 두 회원* 의 컨디션에 묶여 있어서, 그날 두 회원의 특정 약점(checkpoint별 quirk)을 후벼 파는 루틴이 "어려운 운동"으로 둔갑할 수 있다. 저자들도 이 agent gaming/hacking 가능성을 인정하지만 정량적으로 가두지는(empirically bound) 못한다.

한 단계 더 — 트레이너의 코칭 실력 자체도 **헤드 트레이너(meta-optimizer)** 가 다듬는다. 헤드 트레이너는 실패한 루틴들(failure trajectory)을 분석해 트레이너의 코칭 매뉴얼(에이전트 자신의 prompt·recipe)을 233 iterations에 걸쳐 진화적으로 다시 쓴다. 실제 반복(reps)은 GRPO RL로 수행된다.

![Figure 6 — meta-optimizer 루프: 실패 trajectory를 분석해 에이전트의 prompt를 233 iterations에 걸쳐 다시 쓴다.](assets/260625-autodata-fig6-metaopt.png)

### 무엇을 얻었나 (Result)

잘 짠 맞춤 루틴은 헬스장 규모를 이긴다. 가벼운 **4B 체급의 회원** 이 법률(legal) 도메인 맞춤 루틴으로 단련하면 점수 0.441을 내, 일반 루틴으로 단련한 **397B 헤비급** 의 0.404를 앞지른다. "근육량(parameter)"보다 "운동 설계"가 더 중요할 수 있다는 헤드라인 결과다. 같은 legal 과제에서 채택된 루틴의 52%가 GRPO 적합도 상위로 평가된 반면 CoT는 4.8%에 그쳤고, weak-rollout variance도 7.93 → 12.63으로 올라 학습 신호가 풍부해진다.

CS 과제에서는 agentic 데이터로 단련한 회원이 더 어려운 테스트 세트에서 0.632를 기록해 CoT 데이터의 0.500을 넘는다. 수학적 추론(Principia)에서는 정확도가 +3.20% 개선(CoT는 +2.42%)되고, 답안이 길이 제한에 잘려 나가는 token truncation이 23.75% → 4.09%로 줄어든다.

![Figure 3 — Agentic vs CoT Self-Instruct: 학습 reward와 validation 곡선 모두에서 Agentic이 앞선다.](assets/260625-autodata-fig3-results.png)

헤드 트레이너의 코칭 매뉴얼 개정도 효과를 본다 — 트레이너가 짠 루틴의 validation pass rate가 62.1%에서 79.6%로 오른다. 트레이너가 "좋은 루틴을 짜는 실력" 자체가 측정 가능하게 좋아진 것이다.

### 비유가 깨지는 지점 (Limit)

퍼스널 트레이너 비유는 직관적이지만, 바로 그 직관이 논문의 진짜 약점을 가린다.

1. **헬스장 안의 모든 사람이 같은 모델 패밀리다.** 진짜 트레이너는 외부의 객관적 기준(실제 시합 성적)으로 루틴을 검증하지만, 여기서는 트레이너·초보 회원·숙련 회원·헤드 트레이너가 모두 같은 계열의 LLM이 서로를 채점한다. 독립적인 ground truth 저울이 없어서, "숙련은 통과·초보는 실패"라는 간격(0.314)은 **난이도**를 보증할 뿐 데이터의 **정답성(correctness)** 을 보증하지 않는다. 두 회원을 동시에 속이는 잘못된 루틴은 걸러지지 않는다 — R4가 지목한 self-referential·gameable 합격 기준이다.

2. **4B가 397B를 이겼다는 결과에 분리 ablation이 없다.** 이 우위가 (a) agentic 파이프라인 덕인지, (b) 합성 데이터 분포 덕인지, (c) 단지 baseline보다 법률 도메인을 더 많이 본 덕인지를 갈라 보는 통제 실험이 없다. apples-to-apples 비교가 아니라서 "운동 설계가 체급을 이겼다"는 결론은 과장일 수 있다.

3. **meta-optimization 곡선(62.1% → 79.6%)이 루프를 돌리는 바로 그 validation 신호 위에서 측정됐다.** 별도 held-out test가 없어, 트레이너가 채점표 자체에 과적합(overfitting-to-validation)했을 위험이 있다.

4. 검증 도메인이 CS·legal·math로 좁고, 한 세트당 6.59회 반복이라는 inference compute 비용에 상한이 없다. "inference compute를 training 품질로 환전한다"는 매력적 명제의 환율이 실제로 얼마나 비싼지는 미정이다.

요컨대 이 비유의 가장 약한 고리는 **닫힌 자기참조(everyone in the gym is the same model)** 와 **난이도 ≠ 정답성** 의 구분이다. 두 지점은 비유가 주는 "맞춤 코칭이니 믿을 만하다"는 헛된 안도감을 그대로 물려받지 않도록, 반드시 따로 떼어 기억해 둬야 한다.
