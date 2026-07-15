[LLMs Improving LLMs: Agentic Discovery for Test-Time Scaling](https://arxiv.org/abs/2605.08083)

Tong Zheng (University of Maryland), Haolin Liu (University of Virginia), Chengsong Huang (Washington University in St. Louis), Huiwen Bao, Sheng Zhang (University of Maryland), Rui Liu (University of Maryland), Runpeng Dai (University of North Carolina), Ruibo Chen (University of Maryland), Chenxi Liu (University of Maryland), Tianyi Xiong (University of Maryland), Xidong Wu (Google), Hongming Zhang (Meta), Heng Huang (University of Maryland)

> Test-time scaling (TTS) has become an effective approach for improving large language model performance by allocating additional computation during inference. However, existing TTS strategies are largely hand-crafted: researchers manually design reasoning patterns and tune heuristics by intuition, leaving much of the computation-allocation space unexplored. We propose an environment-driven framework, AutoTTS, that changes what researchers design: from individual TTS heuristics to environments where TTS strategies can be discovered automatically. The key to AutoTTS lies in environment construction: the discovery environment must make the control space tractable and provide cheap, frequent feedback for TTS search. As a concrete instantiation, we formulate width–depth TTS as controller synthesis over pre-collected reasoning trajectories and probe signals, where controllers decide when to branch, continue, probe, prune, or stop and can be evaluated cheaply without repeated LLM calls. We further introduce beta parameterization to make the search tractable and fine-grained execution trace feedback to improve discovery efficiency by helping the agent diagnose why a TTS program fails. Experiments on mathematical reasoning benchmarks show that the discovered strategies improve the overall accuracy–cost tradeoff over strong manually designed baselines. The discovered strategies generalize to held-out benchmarks and model scales, while the entire discovery costs only $39.9 and 160 minutes. Our data, and code will be open-source at https://github.com/zhengkid/AutoTTS.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 등산 코치 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

수학 경시대회에 나서는 선수(LLM)에게 지금까지 허락된 전략은 두 가지뿐이다. 같은 루트를 64번 반복 등반해서 가장 많이 도달한 봉우리를 정답으로 찍거나(SC@64), 인간 전문가가 사전에 깎아놓은 고정 루트 가이드를 따르는 것이다(ASC, ESC, Parallel-Probe). 전자는 체력(토큰) 낭비가 심하고, 후자는 가이드를 짠 사람의 직관에 천장이 걸린다. 핵심 문제는 등반 계획 공간 — 어느 고도에서 갈래길을 낼지(width), 얼마나 깊이 파고들지(depth), 언제 포기하고 되돌아올지 — 의 대부분이 미탐색 상태라는 점이다. 인간이 손으로 설계한 컨트롤러 몇 개만으로는 이 거대한 공간의 극히 일부만 찍어볼 수 있다. 결국 필요한 것은 선수가 아닌 등산 코치 — 선수의 과거 등반 기록을 분석하고, 새 루트 전략을 스스로 짜고 검증하는 자동화된 에이전트 — 다. AutoTTS는 이 코치 역할을 LLM 에이전트에게 맡겨 test-time scaling 컨트롤러를 기계적으로 발굴하겠다는 시도다.

### 어떻게 푸는가 (Method)

코치의 작업은 세 단계로 나뉜다. 먼저 **기록 촬영**: AIME24 문제에 대해 temperature 0.7로 문제당 128개 등반 궤적을 미리 생성하고(offline replay), 각 궤적을 Δ=500 토큰 구간으로 분절한다. 이 기록이 코치의 분석 원본이다. 다음으로 **루트 설계**: 코치 에이전트(Claude Code 기반)가 5 라운드에 걸쳐 Python 컨트롤러 프로그램을 작성·수정한다. 컨트롤러는 매 500토큰 checkpoint에서 다섯 가지 행동 — BRANCH(갈래길 생성), CONTINUE(현 루트 유지), PROBE(짧은 정찰 등반), PRUNE(막다른 루트 포기), ANSWER(정상 선언) — 중 하나를 결정한다. 모든 임계값은 beta parameterization으로 단일 β 값에 단조 매핑되어, 코치가 β 하나만 조절하면 보수적 등반(좁고 깊게)에서 공격적 등반(넓고 얕게)까지 스펙트럼 전체를 탐색할 수 있다. 마지막으로 **피드백 루프**: 컨트롤러당 64 evaluations를 돌린 뒤, execution trace feedback — 어느 구간에서 잘못 분기했는지, 어디서 너무 일찍 포기했는지 — 을 코치에게 상세히 돌려준다. 코치는 이 피드백을 읽고 다음 라운드에서 컨트롤러를 개선한다. 전체 탐색 비용은 $39.9, 소요 시간 160분이다. 인간이 개입하는 구간은 없다 — 코치 스스로 설계·실행·반성·개선을 반복한다.

### 무엇을 얻었나 (Result)

코치가 5라운드 끝에 발굴한 최종 등반 전략은 CMC(Confidence Momentum Controller)다. CMC는 현재 분기의 confidence momentum — 최근 checkpoint들의 정답 확신도 변화율 — 을 추적하며, 확신이 꺾이면 빠르게 PRUNE하고 확신이 오르면 CONTINUE로 밀어붙인다. β=0.5 설정에서 SC@64 대비 토큰 사용량을 약 69.5% 절감하면서 정확도는 동등 이상을 달성했다. 이는 Pareto frontier 상에서 기존 인간 설계 컨트롤러(ASC, ESC, Parallel-Probe)를 지배하는 지점이다. AIME24에서 탐색한 CMC를 AIME25와 HMMT25에 그대로 적용했을 때도 성능이 유지되어 일반화가 확인되었다. 모델 스케일 측면에서도 Qwen3 0.6B, 1.7B, 4B, 8B 전체에 걸쳐 일관된 개선을 보였다. 작은 모델일수록 불필요한 등반을 줄여주는 효과가 커서, 코치의 가치가 체력이 부족한 선수에게 더 극적으로 드러났다.

### 비유가 깨지는 지점 (Limit)w

등산 코치 비유가 가리는 구조적 한계가 셋 있다. 첫째, 코치의 훈련 지형이 좁다. offline으로 촬영한 128개 궤적은 AIME24 수학 문제에 한정되고, width-depth 공간에만 인스턴스화되어 있다. 비수학 도메인, tree search 기반 추론, verifier-guided refinement 같은 다른 지형으로의 이전이 검증되지 않았다 — 코치가 설악산만 안다고 히말라야를 안내할 수 있는지는 열린 질문이다. 둘째, beta parameterization의 단조성 제약이 표현력을 깎는다. 실제 최적 전략이 비단조적 임계값 스케줄을 요구할 경우(예: 초반엔 공격적, 중반엔 보수적, 후반엔 다시 공격적) 단일 β로는 포착이 불가능하다. 셋째, 메타적 긴장이 있다. 코치(에이전트)와 선수(LLM)가 같은 모델 패밀리를 공유하므로, 코치의 전략 발굴 능력이 결국 동일 패밀리의 코딩·추론 역량에 묶인다. 5라운드라는 예산 한계도 탐색 공간의 극히 일부만 순회했을 가능성을 남긴다.
