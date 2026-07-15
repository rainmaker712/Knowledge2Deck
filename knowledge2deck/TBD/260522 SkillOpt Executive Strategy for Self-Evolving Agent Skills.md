[SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904)

Yifan Yang, Ziyang Gong, Weiquan Huang, Qihao Yang, Ziwei Zhou, Zisu Huang, Yan Li, Xuemei Gao, Qi Dai, Bei Liu, Kai Qiu, Yuqing Yang, Dongdong Chen, Xue Yang, Chong Luo

> Agent skills today are hand-crafted, generated one-shot, or evolved through loosely controlled self-revision, none of which behaves like a deep-learning optimizer for the skill, and none of which reliably improves over its starting point under feedback. We argue the skill should instead be trained as the external state of a frozen agent, with the same discipline that makes weight-space optimization reproducible. SkillOpt is, to our knowledge, the first systematic controllable text-space optimizer for agent skills: a separate optimizer model turns scored rollouts into bounded add/delete/replace edits on a single skill document, and an edit is accepted only when it strictly improves a held-out validation score. A textual learning-rate budget, rejected-edit buffer, and epoch-wise slow/meta update make skill training stable while adding zero inference-time model calls at deployment. Across six benchmarks, seven target models, and three execution harnesses (direct chat, Codex, Claude Code), SkillOpt is best or tied on all 52 evaluated (model, benchmark, harness) cells and beats every per-cell competitor among human, one-shot LLM, Trace2Skill, TextGrad, GEPA, and EvoSkill skills. On GPT-5.5 it lifts the average no-skill accuracy by +23.5 points in direct chat, by +24.8 inside the Codex agentic loop, and by +19.1 inside Claude Code. Transfer experiments further show that optimized skill artifacts retain value when moved across model scales, between Codex and Claude Code execution environments, and to a nearby math benchmark without further optimization. Code: https://aka.ms/skillopt

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: a kitchen's single recipe card revised only when a blind tasting panel scores higher -->

## 비유로 풀어보기

식당 주방에 단 한 장의 recipe card가 붙어 있다고 생각하자. 요리사(agent)의 손맛 자체는 한 번 고용되면 바뀌지 않는다(frozen). 음식 맛을 좌우하는 건 오직 벽에 붙은 그 한 장의 카드뿐이다. SkillOpt는 이 카드를 weight를 학습하듯 "외부 상태(external state)"로 보고, 정식 optimizer처럼 규율 있게 고쳐 나간다.

### 풀려는 문제 (Problem)

지금까지 주방의 recipe card는 셋 중 하나로 만들어졌다. 베테랑이 손으로 적거나(hand-crafted), LLM에게 한 번에 받아쓰거나(one-shot), 아니면 요리사가 제멋대로 카드를 다시 쓰게 두거나(loosely controlled self-revision). 세 방식 모두 카드를 weight-space optimizer처럼 다루지 못하고, feedback을 받아도 출발점보다 안정적으로 나아진다는 보장이 없다. 손맛(model weight)은 고정해 둔 채, 벽에 붙은 그 한 장을 weight 최적화만큼 재현 가능한 규율로 "훈련"할 수는 없을까 — 이것이 논문이 푸는 문제다.

### 어떻게 푸는가 (Method)

핵심은 "요리하는 사람"과 "카드를 고치는 사람"을 분리한 것이다. target model이 현재 카드를 들고 실제로 요리를 해 본다(forward pass = rollout). harness가 그 과정을 기록하고 0~1 사이 점수 r(s)를 매긴다. 그다음 별도의 optimizer model이 맛본 결과를 minibatch(default size 8)로 묶어, 성공한 접시와 실패한 접시를 따로 reflection하며 카드에 add/delete/replace edit을 제안한다(backward pass).

여기서 규율이 들어간다. 한 번에 카드를 통째로 다시 쓰지 않는다. 제안된 수정은 textual "learning-rate" 예산 L_t로 잘린다(default 4 edits, cosine decay로 최소 2까지). 그리고 validation gate: 수정된 카드는 held-out selection-split 점수가 현재보다 strictly 높을 때만(동점은 거부) 채택된다. hash caching으로 같은 카드를 두 번 평가하지 않는다. 거부된 수정은 rejected-edit buffer에 적어 두고, 다음 reflection에 같이 넘겨 "이건 전에 해 봤는데 안 됐다"를 반복하지 않게 한다. epoch이 끝날 때마다 이전 카드와 현재 카드를 비교하는 slow/meta update가 돌아, 오래 살아남은 규칙을 meta skill(optimizer-side 전용)로 요약하고, step-level edit이 건드릴 수 없는 보호 영역에 적어 둔다.

배포 시점에는 이 모든 부엌일이 사라진다. 손님에게 나가는 것은 1~4번의 채택된 edit을 거친 compact한 best_skill.md(300~2,000 token) 한 장뿐이고, deployment에서 optimizer model 호출은 zero, 즉 inference-time model call이 전혀 추가되지 않는다.

### 무엇을 얻었나 (Result)

이 "한 장만 고치는" 규율은 메뉴판 전체를 휩쓸었다. six benchmarks(SearchQA, SpreadsheetBench, OfficeQA, DocVQA, LiveMathematicianBench, ALFWorld), seven target models(GPT-5.5, GPT-5.4, GPT-5.4-mini, GPT-5.4-nano, GPT-5.2, Qwen3.5-4B, Qwen3.6-35B-A3B), three execution harnesses(direct chat, Codex, Claude Code)를 교차한 52개 (model, benchmark, harness) cell 전부에서 best-or-tied — 즉 all 52 cells에서 1등 아니면 공동 1등이었다.

같은 한 장의 카드가 모든 경쟁 레시피를 이긴다. GPT-5.5 direct chat에서 SkillOpt 평균은 82.3으로, no skill 58.8 대비 +23.5점이며, human skill(72.0), one-shot LLM skill(73.3), Trace2Skill(75.4), TextGrad(74.5), GEPA(76.9)를 모두 제쳤다. 심지어 cell마다 여섯 경쟁자 중 최고만 골라 만든 oracle baseline(76.9)보다도 +5.4점 앞섰다. 개별 접시로 보면 SpreadsheetBench 41.8→80.7(+38.9), OfficeQA 33.1→72.1(+39.0), LiveMathematicianBench 37.6→66.9(+29.3), DocVQA 78.8→91.2(+12.4), ALFWorld 83.6→95.5(+11.9), SearchQA 77.7→87.3(+9.6).

tool-execution harness에서도 같은 카드가 통했다. GPT-5.5 기준 Codex는 no skill 대비 +24.8점(EvoSkill 대비 +14.0), Claude Code는 +19.1점(EvoSkill 대비 +3.2). 카드 한 장이 주방을 옮겨도 따라간다: cross-harness로 SpreadsheetBench가 Codex→Claude Code +59.7점(22.1→81.8), Claude Code→Codex +43.6점(27.5→71.1). model 규모를 가로질러도 GPT-5.4→GPT-5.4-mini SpreadsheetBench +9.4, →nano +3.0처럼 전이됐다. per-model direct chat 평균 향상은 GPT-5.4 +12.7, GPT-5.4-mini +15.4, GPT-5.4-nano +26.7, GPT-5.2 +16.6, Qwen3.5-4B +19.2, Qwen3.6-35B-A3B +9.1로 전체 평균 약 +17.6점. 최종 카드는 379~1,995 token(median ~920)에 채택 edit 1~4개로 여전히 한 장 분량을 유지했다.

### 비유가 깨지는 지점 (Limit)

recipe card 비유는 "맛 점수를 객관적으로 매길 수 있다"는 가정 위에 서 있다. 그런데 논문 스스로 인정하듯, SkillOpt의 validation gate는 automatic verifier나 신뢰할 수 있는 feedback signal이 있어야 작동한다 — 주관적이거나 다차원적인 평가(plating의 아름다움 같은 것)에서는 "strictly improves" 판정 자체가 흔들린다. 비유는 이 채점의 어려움을 거의 숨긴다.

둘째, 카드를 다듬는 주방일(training)에는 비용이 든다. test-point 한 점을 올리는 데 0.6~46.4M token이 들고, 이 비용은 같은 카드를 여러 번 재사용해야 분산된다 — 한 번 쓰고 버릴 일회성 요리에는 수지가 안 맞는다.

셋째, 비유는 "한 장의 카드"를 이상화한다. 하지만 single skill 한 장으로는 서로 동떨어진 절차가 필요한 highly heterogeneous domain을 담기 어렵다(한식·양식·제과를 카드 한 장에 욱여넣을 수 없다). 넷째, optimizer 강도에 성능이 묶인다: 강한 frontier optimizer(GPT-5.5)는 target-matched optimizer 대비 gain의 56~74%를 회복하지만, 약한 채점자/수정자로는 같은 카드 품질이 안 나온다. 마지막으로 최적화된 카드는 training-distribution heuristic을 인코딩할 수 있어, 멀리 떨어진 곳으로 옮기기 전에는 신중한 평가가 필요하다 — 우리 주방에서 완벽했던 레시피가 다른 식재료 앞에서 깨질 수 있다는 뜻이고, 비유는 이 distribution shift 위험을 잘 보여주지 못한다.

> Cross-link: "요리하는 자(target model)"와 "카드를 고치는 자(optimizer model)"를 분리한 SkillOpt의 핵심은 [[260615 Loop Engineering The Anthropic Playbook]]가 loop 설계의 심장이라 부른 generator/evaluator separation의 한 구현이다. 또 SkillOpt는 weight를 frozen으로 두고 *텍스트 skill만* 훈련하는데, 이는 weight update까지 가는 [[260526 SIA Self Improving AI with Harness and Weight Updates]]와 정확히 대비된다. harness 위에서 skill을 다룬다는 점에서 [[260518 Code as Agent Harness]]와도 묶인다.
