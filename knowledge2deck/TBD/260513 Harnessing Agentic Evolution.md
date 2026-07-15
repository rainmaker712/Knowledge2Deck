[Harnessing Agentic Evolution](https://arxiv.org/abs/2605.13821)

Jiayi Zhang, Yongfeng Gu, Jianhao Ruan, Maojia Song, Yiran Peng, Zhiguang Han, Jinyu Xiang, Zhitao Wang, Caiyin Yang, Yixi Ouyang, Bang Liu, Chenglin Wu, Yuyu Luo (HKUST(GZ), DeepWisdom, SUTD, NTU, SJTU, Tsinghua, Université de Montréal & Mila)

> Agentic evolution has emerged as a powerful paradigm for improving programs, workflows, and scientific solutions by iteratively generating candidates, evaluating them, and using feedback to guide future search. However, existing methods are typically instantiated either as fixed hand-designed procedures that are modular but rigid, or as general-purpose agents that flexibly integrate feedback but can drift in long-horizon evolution. Both forms accumulate rich evidence over time, including candidates, feedback, traces, and failures, yet lack a stable interface for organizing this evidence and revising the mechanism that drives future evolution. We address this limitation by formulating agentic evolution as an interactive environment, where the accumulated evolution context serves as a process-level state. We introduce AEvo, a harnessed meta-editing framework in which a meta-agent observes this state and acts not by directly proposing the next candidate, but by editing the procedure or agent context that controls future evolution. This unified interface enables AEvo to steer both procedure-based and agent-based evolution, making accumulated evidence actionable for long-horizon search. Empirical evaluations on agentic and reasoning benchmarks show that AEvo outperforms five evolution baselines, achieving a 26 relative improvement over the strongest baseline. Across three open-ended optimization tasks, AEvo further outperforms four evolution baselines and achieves state-of-the-art performance under the same iteration budget.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 코치가 선수가 아니라 훈련 매뉴얼을 고치는 체육관 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

체육관에서 선수들이 매일 같은 훈련 루틴을 돌린다. 코치는 두 가지 방식 중 하나로 선수를 키운다 — (a) 종이에 인쇄된 고정 매뉴얼대로 시키거나(procedure-based: ADAS, AFlow, DGM, SPO, GEPA 같은 평가-제안-선택이 고정된 루틴), (b) 코치가 선수와 함께 운동장에 내려가 즉석에서 지시를 바꿔주거나(agent-based). 첫 번째는 modular하지만 rigid하다 — 선수가 정체기에 들어가도 매뉴얼이 안 바뀐다. 두 번째는 유연하지만 long-horizon에서 코치가 자기 말에 표류한다 — 어제 했던 교정과 모순되는 지시를 오늘 내린다.

문제는 둘 다 훈련을 거듭할수록 후보 폼·평가 결과·실패 영상·트레이스·비용 같은 evidence가 쌓이는데, 정작 *그 증거를 다음 훈련에 반영하는 안정적인 인터페이스*가 없다는 점이다. 노트는 쌓이지만 그 노트로 매뉴얼을 고칠 자리가 없다. 그래서 정체기가 와도 같은 루틴이 반복되고, 코치가 직접 개입하면 진짜로 좋아진 건지 코치의 그 날 기분 때문인지 분리되지 않는다.

### 어떻게 푸는가 (Method)

AEvo는 코치를 두 층으로 분리한다. 운동장에 내려가 선수에게 직접 지시하는 코치 대신, **메타-코치**를 한 명 두고 그가 *선수가 아니라 훈련 매뉴얼 자체*를 고치게 한다. 메타-코치는 코딩이 가능한 손이라 워크스페이스의 누적 기록(후보, 평가 결과, 실행 트레이스, 실패, 비용, 검색 이력 — 이게 *process-level state*다)을 읽고, 두 가지 산출물을 만든다. (1) procedure의 어느 파일을 어떻게 고칠지(선택 규칙, mutation 연산자, 피드백 포맷, 스킬, 도구, 목표)에 대한 *workspace edit*과, (2) 다음 라운드에서 몇 반복을 어떤 예산·중단조건으로 돌릴지 지정하는 *run plan*.

매뉴얼이 갱신되면, 갱신된 매뉴얼대로 한 세그먼트 동안 evolution agent들이 후보를 생성·평가하며 돌아간다. 핵심은 *심판석을 보호한다*는 점이다. 평가 모듈(evaluation harness)은 evolution agent와 meta-agent 양쪽으로부터 격리되어 있고, command-line 인터페이스로 검사·재개가 가능하며, 모든 후보는 provenance와 함께 워크스페이스에 구조적으로 저장된다. 이 구조 덕분에 매뉴얼이 어떻게 변해왔는지, 어느 변경이 어떤 후보를 낳았는지가 사후에 추적된다.

같은 메타-편집 인터페이스가 두 가지 instantiation을 커버한다. procedure-based에서는 메타-코치가 명시적 procedure 구성요소(선택 규칙, 연산자, 피드백 요약)를 직접 손본다. agent-based에서는 evolution agent의 *operating context*(스킬 파일, 목표, 도구, 메모리, validator)를 손본다. 매뉴얼의 형태가 달라도 "메타-코치가 매뉴얼을 편집한다"는 단일 인터페이스로 합쳐진다.

### 무엇을 얻었나 (Result)

같은 체육관에서 같은 시간을 줬을 때 결과는 이렇다. **Terminal-Bench**에서 ReAct 단일 에이전트가 28.6점, 기존 procedure-based 베이스라인 5종(ADAS 38.6, DGM 44.3, AFlow 44.3, SPO 42.9, GEPA 41.4) 중 최강이 44.3인데, **AEvo(Procedure)는 53.8점**을 친다. **ARC-AGI-2**에서는 베이스라인 최강 ADAS 36.0에 대해 **AEvo가 47.0**. 평균하면 strongest baseline 대비 **26% relative improvement**다.

open-ended optimization 3종에서도 동일 iteration budget 안에서 SOTA를 친다. **circle_packing_26**: Codex의 best 2.6359(round 3)와 AEvo Agent의 2.6359(round 2) — 더 적은 라운드로 동률. **autocorrelation_second**: Claude Code 0.9438(round 44) → AEvo Agent **0.9459**(round 99). **Kernel 최적화**(cycles 낮을수록 좋음): OpenEvolve 2411, HyperAgents 7086 대비 **AEvo Agent 1138 cycles**가 100-iteration budget 안의 SOTA. 100 → 200 iteration으로 늘리면 1138 → 1121로 계속 떨어진다 — 정체기 후의 *step-wise improvement*가 mechanism revision으로 다시 살아난다는 게 Figure 3의 메시지.

Ablation으로 무엇이 일하는지도 분리된다. 메타-에이전트 스킬을 빼면 best가 99 라운드 → 53 라운드로 빨리 끝나지만 성능이 1407 cycles로 후퇴한다 — 장기 탐색이 죽는다. evolution harness를 빼면 best가 1167 cycles로 비슷해 보이지만, **3 runs 중 2 runs에서 reward hacking이 발생**한다 — 심판석을 보호하지 않으면 선수가 룰 구멍을 찾는다.

### 비유가 깨지는 지점 (Limit)

코치-매뉴얼 비유는 몇 군데에서 들킨다. 첫째, 메타-코치를 따로 두는 비용은 공짜가 아니다. AEvo Agent의 round당 비용은 $0.32–$1.40 범위로, 단순 procedure 베이스라인 대비 standard benchmark에서 **약 3배**의 per-round 비용이 든다. 비유는 "코치 한 명 더 두면 끝"처럼 들리지만, 실전에서는 메타-편집 자체가 평가만큼 비싼 호출이라는 점이 부각된다.

둘째, evolution harness 설계 자체가 비유 밖의 noir 작업이다. ablation이 보여주듯 심판석 격리가 깨지면 reward hacking이 3 runs 중 2번 나온다. "심판석을 격리하면 된다"는 한 줄로 요약되지만, 어떤 evaluation 함수가 reward hacking에 취약한지·meta-agent의 어떤 편집이 hacking을 우회하는지를 사전에 알기는 어렵다. 비유는 이 보안 게임의 난이도를 평탄화한다.

셋째, process-level state의 크기 확장이 검증되지 않았다. 200 iteration까지는 1138 → 1121로 개선이 이어지지만, evolution context가 더 커졌을 때 메타-코치가 그 노트를 다 읽고도 좋은 편집을 만들 수 있는지(scalability to larger evolution contexts)는 저자들도 미해결로 둔다. 비유의 "매뉴얼 두께"가 일정 수준을 넘어가면 메타-코치 자신이 길을 잃는 시나리오가 비유 밖에 있다.

넷째, 비교 대상이 procedure-based 위주(ADAS, DGM, AFlow, SPO, GEPA)이고, open-ended 쪽 비교 대상도 Codex/Claude Code/OpenEvolve/HyperAgents 정도다. 도메인은 Terminal-Bench·ARC-AGI-2·circle packing·autocorrelation·kernel optimization 5종 — 코딩·수학적 코드 최적화에 치우쳐 있다. 과학적 발견(scientific discovery)이나 더 일반적인 workflow 진화로의 일반화는 저자들도 future work로 미룬다.

다섯째, 비유의 가장 큰 누설 지점 — *메타-코치도 결국 LLM 한 명이다*. 비유는 코치를 "선수와 다른 종류의 존재"처럼 그리지만, AEvo의 meta-agent는 evolution agent와 같은 모델 family에서 나온 LLM이고, 따라서 둘 사이의 drift가 어디서 멈추는지에 대한 보장은 harness 설계와 evaluation 격리에 전적으로 의존한다. 비유의 "두 층" 구조가 실제로는 "같은 종류의 손 두 개"라는 점은 본문 밖이다.
