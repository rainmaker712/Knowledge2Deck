[Agent-World: Scaling Real-World Environment Synthesis for Evolving General Agent Intelligence](https://arxiv.org/abs/2604.18292)

Guanting Dong, Junting Lu, Junjie Huang, Wanjun Zhong, Longxiang Liu, Shijue Huang, Zhenyu Li, Yang Zhao, Xiaoshuai Song, Xiaoxi Li, Jiajie Jin, Yutao Zhu, Hanbin Wang, Fangyu Lei, Qinyu Luo, Mingyang Chen, Zehui Chen, Jiazhan Feng, Ji-Rong Wen, Zhicheng Dou

> Real-world 환경을 MCP 서버·tool docs에서 자동 mining하고, graph-based + programmatic 이중 경로로 verifiable task를 합성한 뒤, capability-gap 자가진단으로 다음 라운드의 환경 확장 방향을 steering하는 closed-loop curriculum으로 14B agent를 GRPO로 훈련해 23개 벤치마크에서 더 강한 baseline을 추월한다.

<!-- Panel Verdict: CONDITIONAL — R5+ veto cleared. Panel #1 R1+/R2?/R3+/R4-/R5+; Panel #3 R1+/R2?/R3+/R4?/R5+. Working-in-progress paper, follow-up version tracking 권장. -->

## Key Contributions

- **Closed-loop curriculum (R1/Novelty):** 환경 합성과 self-evolve 훈련을 capability-gap 피드백으로 직접 연결. 기존 AgentTrek/Spider2/ToolBench의 *정적 task pool* 합성과 달리, auto-diagnosis agent가 failure trace를 분석해 다음 라운드의 환경 mining 방향을 결정하는 *adaptive* 분포다.
- **Sandbox-validated tool synthesis + 이중 경로 task 생성 (R2/Technical):** Real MCP servers + tool docs에서 추출한 환경 theme를 sandbox에서 >50% test pass threshold로 자동 검증해 executable tool interface를 만들고, task는 (a) graph 기반 reverse-engineering(weighted dependency)과 (b) programmatic Python solution + verification script의 이중 경로로 합성. ToolBench/APIBench의 단일-경로 LLM 합성과 mechanically 다르며, sequential tool-calling과 algorithmic reasoning을 모두 커버한다.
- **MCP 환경으로 확장된 RLVR (R3/Impact):** GRPO + executable rewards에서 reward 신호를 *database state transition* 일치로 정의 — RLVR의 verifiable 도메인을 텍스트 정답에서 MCP 실행 환경의 side-effect로 일반화한 사례. 23개 벤치마크에서 일관된 향상: MCP-Mark 13.3% (vs Qwen3-8B 3.3%, 4×), BFCL V4 55.8%, τ²-Bench 65.4% (split은 본문 확인 필요), 10→2000 envs scaling으로 평균 +20.1pt(23-bench mean).
- **Closed-loop의 echo-chamber 위험 (R4/Critical):** External oracle 없는 self-diagnosis 루프는 세 가지 실패 모드를 안는다 — diagnostic monoculture (진단 모델이 systematically misclassify하면 편향이 누적), distribution lock-in (환경 합성기가 backbone GPT-OSS-120B의 분포에 갇힘), 정상 작동 도구 경유 reward hacking (broken tool과 별개 — agent가 task semantics가 아닌 DB write 경로 자체를 exploit). 2 라운드 +8.6%만 보고된 점, MCP-Mark 절댓값 13.3%(여전히 87% fail)는 이 우려를 뒷받침한다.
- **세 deck 축의 교차점 (R5/Relevance):** RLVR/GRPO 라인(DeepSeek-V4·DAPO), 합성 데이터 self-curation 패턴(Seed-Coder·Rewriting Pre-Training Data), agent 평가 라인(BFCL·τ²·MCP-Mark — 각각 function-calling 정확도/multi-turn 대화/MCP 환경 stateful task로 상호 보완). Self-curation을 "데이터 selection"에서 "데이터 생성 분포(=환경)" 레이어로 한 단계 끌어올렸다. (cf. AgentTrek/AppWorld/OSWorld는 deck 외부 참조 — 환경 fidelity 관점의 대조군으로만 인용.)

## Method / Architecture

**Agentic Environment-Task Discovery.** Deep-research agent가 MCP 서버, tool documentation, 산업 요구에서 수천 개 real-world theme를 mining → 각 theme에 대해 topic-aligned database를 web에서 추출 → executable tool interface를 생성하고 sandbox에서 자동 생성된 test의 50% 이상을 통과하는 인터페이스만 채택. 이 50% threshold는 정상적인 negative case(실패에서 학습되어야 하는 케이스)를 보존하기 위한 의도적 loose floor로 해석되나, 환경 품질 분산의 하방 리스크를 동반한다. Task는 두 갈래로 합성: (i) graph-based — weighted-dependency tool graph에서 sequence를 역공학, (ii) programmatic — Python control flow + verification script을 함께 생성해 algorithmic reasoning까지 cover. 합성·검증·진단의 backbone은 모두 GPT-OSS-120B (→ Takeaways 4의 ceiling 논의로 연결).

**Continuous Self-Evolving Training.** Multi-environment GRPO RL. Reward는 LLM-as-judge나 final-answer matching이 아니라 *database state transition*이 expected와 일치하는지로 정의 — side-effect 기반이라 텍스트 답안 reward hacking에는 강하다(단, working-tool 경유 state-write hacking은 별개 위험; → 답변 3·6 참고). Step-level credit assignment 메커니즘은 논문에 명시되지 않으며, GRPO group-relative advantage가 outcome reward를 group baseline으로 정규화하는 구조로 추정된다(→ 답변 2). 매 iteration마다 fresh task가 합성되고, auto-diagnosis agent가 직전 라운드의 failure trace를 분석해 capability gap을 분류한 뒤, 그 진단 결과가 다음 라운드의 targeted environment expansion을 구동하는 closed-loop curriculum.

## Results

| Benchmark | Agent-World-14B | 비교 baseline |
|---|---|---|
| MCP-Mark | 13.3% | Qwen3-8B 3.3% (4×) |
| BFCL V4 | 55.8% | EnvScaler-8B 47.6% |
| τ²-Bench | 65.4% | Qwen3-14B 41.0% |

- 23개 벤치마크 전반에서 일관된 향상, 더 강한 proprietary baseline도 추월(논문 주장; 비교 모델의 구체 버전·평가 시점은 본문 별도 확인 필요).
- Environment scaling: 10 → 2000 envs ⇒ **23-bench 평균 +20.1pt** (다양성이 1차 lever라는 증거)
- Self-evolution: MCP-Mark 기준 2 라운드에 +8.6% 단조 증가 — **3+ 라운드 결과는 미보고**(working-in-progress 단계의 핵심 공백, → 답변 3)

## Takeaways

- **Self-curation의 추상화 단계가 한 칸 올라갔다.** Seed-Coder/Rewriting이 *데이터 selection*을 모델에 위임했다면, Agent-World는 *데이터 생성 분포(환경)*를 모델 진단으로 steering. 다음 단계는 환경 합성기 자체의 self-evolve.
- **RLVR이 "환경"으로 확장됐다.** DB state transition을 reward로 쓰는 것은 RLVR의 verifiable 도메인을 텍스트·코드 정답에서 환경 side-effect로 일반화한 패턴. 단, multi-step credit assignment는 명시되지 않은 채 GRPO group baseline에 외주된 것으로 추정된다.
- **`>50% sandbox threshold`는 의도적으로 느슨한 floor.** GRPO group-relative advantage가 noisy reward를 흡수한다는 통계적 베팅 — 환경별 noise가 unbiased하면 견디지만, systematic bias가 들어오면 무너진다.
- **Backbone ceiling이 ceiling이다.** 합성·검증·진단 모두 GPT-OSS-120B에 의존하므로 14B agent의 진정한 상한은 "120B가 verify할 수 있는 행동의 집합"으로 제한. 반증 조건: 더 약한 backbone(예: 32B)으로 swap해도 14B 성능이 유지되거나, GPT-OSS-120B를 zero-shot agent로 평가했을 때 14B가 그 점수를 *초과*하면 distillation 가설이 약화된다 (→ 답변 7).

> [!WARNING] **검증 미완료 항목 (Panel #1·#3 CONDITIONAL 사유)**
> - Sandbox >50% threshold 결정 근거 및 환경 분포 편향 (→ 답변 1·4)
> - 3+ 라운드 self-evolution 안정성·diagnosis bias accumulation (→ 답변 3)
> - 절대 점수 floor (MCP-Mark 13.3%) 의미 해석
> - GAIA/HLE subsampling 방법론 (subset 크기·sampling 전략·full-set 재현 가능성) — 논문 본문 확인 필요
> - "Stronger proprietary baseline" 추월 클레임의 비교 모델 버전·평가 시점 고정
> - Working-in-progress 상태 — 후속 버전 추적 필요

## Follow-Up Questions

1. **(R2 Technical)** Sandbox validation의 >50% test accuracy threshold는 어떻게 결정되었으며, 이 임계값이 합성된 tool interface의 분포 편향을 어떻게 만드는가? 특히 2000-env scaling의 +20.1pt가 "쉬운 환경의 양적 확장"인지 "어려운 환경 커버리지 확장"인지 구분 가능한가?
2. **(R2 Technical)** Database state transition을 reward로 쓸 때 multi-step task의 credit assignment는 어떻게 처리되는가 — GRPO의 group-relative advantage가 중간 단계의 잘못된 DB write를 어떻게 페널티하는가?
3. **(R4 Critical)** Self-evolution의 단조 증가가 2 라운드 이후에도 유지되는가? 외부 oracle 없는 closed-loop가 diagnosis bias accumulation으로 발산/정체될 가능성은? 그리고 정상 작동하는 도구를 통한 reward hacking(예: agent가 task semantics 대신 DB write 경로 자체를 exploit하는 경우)은 broken-tool noise와 어떻게 구분 가능한가?
4. **(R4 Critical)** Sandbox validation threshold를 50%에서 90%로 올리면 환경 수가 얼마나 감소하고, 학습된 agent의 generalization은 어떻게 변하는가? "scale 2000 envs"가 quantity-for-quality trade-off인지 진짜 diverse coverage 효과인지 분리하기 위한 실험 설계는? 더불어 GAIA/HLE 서브샘플 크기·sampling 전략·full-set 재현 가능성이 명시되지 않은 것은 평가 신뢰도에 어떤 영향을 주는가?
5. **(R5 Relevance — STaR/ReST 대비)** MCP-Mark의 +8.6%/round self-evolve 이득은 STaR/ReST 계열 self-improvement 수렴 패턴과 어떻게 다른가? Environment expansion이 멈추면 plateau인가, 모델 capability가 다음 environment를 unlock하는 진정한 open-ended loop인가?
6. **(R5 Relevance — Curated env 대비)** AgentTrek/AppWorld/OSWorld가 "human-curated 고품질 환경"을 추구한 반면 Agent-World는 "MCP scraping으로 양적 폭발"을 택했다. 환경 품질(>50% sandbox pass)의 하한선과 GRPO 학습 안정성의 관계는? 저품질 환경이 policy collapse를 유발하지 않는 mechanical 이유는?
7. **(Synthesis — backbone ceiling)** Synthesis backbone이 GPT-OSS-120B인데, 14B agent의 self-evolve 루프가 결국 120B의 capability ceiling에 갇히지 않는가? Agent-World-14B의 성능 향상이 진정한 self-improvement인지, 정교한 distillation인지를 어떻게 구분할 수 있나? 특히 "stronger proprietary baseline 추월" 클레임의 비교 모델 버전·평가 시점이 고정되지 않으면 이 구분이 어떻게 추가로 흐려지는가?

## Answers

**1.** 논문은 50% threshold 선택의 근거(예: validation pass 분포의 elbow, downstream RL 수렴성 ablation)를 명시하지 않으며, GPT-OSS-120B가 sandbox 안에서 자체 생성한 test case를 절반 이상 통과하면 채택하는 self-consistency 형태의 휴리스틱으로 추정된다. 이 경우 threshold는 backbone이 "이해하기 쉬운" tool — 즉 REST 스타일 CRUD나 잘 문서화된 MCP server — 쪽으로 분포를 편향시키고, OS-level state mutation이나 비결정적 long-horizon API는 통과율이 낮아 자연 도태된다. 따라서 +20.1pt scaling 곡선이 "쉬운 환경의 양적 누적"인지 "난이도 다양화"인지 분리하려면 환경별 sandbox pass rate 분포(50–60% vs 90–100% 비율)와 환경 난이도 prior(예: tool chain length, state-space cardinality)에 따른 marginal contribution을 분해해야 하는데, 논문 figure는 평균만 보고하므로 현재 데이터로는 구분 불가능하다. 정황상(MCP-Mark 4× gain의 절댓값이 13.3%에 불과한 점) "쉬운 long tail" 기여분이 상당할 가능성이 높다.

**2.** 논문은 reward 정의를 "DB read/write 기반 environment-state transition"이라고만 기술하고 step-wise vs trajectory-level의 구분을 명시하지 않지만, GRPO 채택과 "executable rewards" 표현으로 미루어 trajectory 종료 시점의 final state가 expected state와 일치하는지를 binary/scalar로 채점하는 outcome-based reward로 추정된다. 이 경우 중간 단계의 잘못된 DB write는 직접 페널티되지 않고, 같은 prompt에 대한 group 내 다른 rollout이 그 실수를 회피해 성공하면 GRPO의 group-relative advantage가 자연히 음수가 되어 해당 trajectory 전체의 log-prob을 낮춘다 — 즉 credit assignment가 step이 아닌 group baseline에 외주된다. 이 설계는 dense reward shaping이 필요 없다는 장점이 있지만 long-horizon에서 "마지막 단계만 우연히 맞춘 trajectory"가 잘못된 중간 행동까지 강화하는 spurious credit 문제를 안고 있으며, 논문이 보고한 τ²-Bench 65.4%에서 trajectory 길이별 성공률 분해가 없다는 점이 이 우려와 맞물린다.

**3.** 논문이 2 라운드까지만 단조 증가(+8.6%)를 보고하고 3–4 라운드를 생략한 사실은 그 자체로 약한 negative signal로 읽힌다 — "working in progress" 표기와 결합하면 후속 라운드에서 plateau 또는 regression이 관측되었을 가능성을 배제할 수 없다. 외부 oracle 없는 closed-loop는 세 가지 발산 경로를 갖는다. (a) auto-diagnosis agent가 실패 trace를 자기 prior로 해석하므로 "진짜 약점"이 아닌 "diagnosis agent가 약점이라 부르기 쉬운 패턴"을 반복적으로 보강하는 diagnostic monoculture, (b) targeted env expansion이 합성 backbone(GPT-OSS-120B)이 만들 수 있는 분포 안에서만 일어나므로 라운드가 누적될수록 backbone의 epistemic blindspot이 그대로 학습 분포에 고정되는 distribution lock-in, (c) 정상 작동하는 도구를 경유한 reward hacking — agent가 task semantics가 아닌 DB write 경로 자체를 exploit해 expected state에 도달(WebArena에서 문서화된 working-tool misuse와 동형). 셋 다 발산보다는 점근적 정체로 나타날 가능성이 크고, 이를 검증하려면 라운드별 새 환경의 entropy/novelty metric, fixed held-out task의 성능, 그리고 trajectory의 tool-call 정합성(의도된 경로와 일치 비율)을 함께 추적해야 한다(논문은 보고하지 않음).

**4.** Threshold를 90%로 올리면 답변 1에서 논의한 분포 편향 메커니즘이 더 강하게 작동해 환경 수는 양적으로 큰 폭(추정상 1/3–1/5 수준)으로 감소하고, 살아남는 환경은 stateless·deterministic·short-horizon으로 더 편향될 것이다. 학습된 agent의 generalization 영향은 양가적이다 — 한편으로 reward signal이 깨끗해져 GRPO 수렴이 안정화되지만, 다른 한편으로 MCP-Mark·τ²-Bench처럼 noisy한 real tool을 다루는 벤치마크에서는 분포 외 일반화가 약해질 수 있다. Quantity vs quality를 분리하려면 (i) 동일 compute 하에서 "50% threshold + 2000 env" vs "90% threshold + N env" matched-budget ablation, (ii) env diversity를 tool type/domain/chain length의 multidimensional coverage로 측정해 단순 count와 분리, (iii) held-out unseen-MCP 평가로 진짜 coverage gain을 검증하는 세 축이 필요하다. 한편 GAIA/HLE의 subset 크기·sampling 전략·full-set 재현 가능성이 본문에 명시되지 않으면, "23-bench 평균 추월"은 GSM8K subsampling이 5–10pt 과대 추정을 유발한 2023년 선례와 같은 함정에 노출된다 — Q&A에서 이 검증을 별도 압박 사항으로 둔 이유다.

**5.** STaR/ReST 계열은 *고정된* task 분포에서 모델이 만든 high-quality rationale/trajectory를 self-train에 재투입하므로, 모델 capability와 task 난이도 분포가 함께 stagnate해 보통 2–3 라운드 안에 plateau에 도달한다. Agent-World의 핵심 차별점은 self-evolve 루프에 *환경 분포 자체의 expansion*이 결합돼 있다는 점으로, capability 향상이 새 영역의 환경 합성을 unlock한다는 점에서 형식적으로는 open-ended에 가깝다. 그러나 답변 3·7에서 짚었듯 새 환경을 만드는 주체가 모두 GPT-OSS-120B라는 *동일한 외부 backbone*이라 진정한 open-endedness가 성립하려면 환경 합성기 자체가 함께 진화하거나 14B agent가 합성기 역할을 일부 흡수해야 한다. 따라서 현재 setup은 STaR보다 plateau가 늦게 오는 "지연된 수렴"일 가능성이 높고, 본격 open-ended loop라기보다는 "외부 backbone이 정의한 분포 안에서의 active curriculum"으로 보는 것이 정확하다.

**6.** 일반적으로 noisy reward 환경에서 policy gradient는 high-variance gradient로 인해 collapse 위험이 크지만, GRPO는 group baseline을 이용한 *상대적* advantage 정규화 덕분에 절대 reward의 noise를 일정 부분 흡수한다 — 같은 prompt 그룹 안에서 모든 rollout이 비슷한 정도로 잘못된 reward를 받아도 advantage는 0 근처가 되어 update 자체가 사라지기 때문이다. 이 mechanical 특성이 50% threshold라는 느슨한 quality bar를 학습 안정성과 양립시키는 핵심으로 보인다(논문에서 명시적 분석은 없음). 다만 이는 "low-quality 환경의 reward noise가 group 내에 균등하게 퍼져 있을 때"에만 성립하는 보호이며, 특정 환경이 *체계적으로 잘못된* reward를 주면 group baseline도 함께 오염돼 보호가 무너진다. AgentTrek/AppWorld가 환경 수를 희생하고 high-fidelity를 택한 것은 이 systematic-bias 위험을 회피하는 보수적 선택이고, Agent-World는 "수많은 noisy 환경의 noise는 평균적으로 unbiased일 것"이라는 통계적 베팅에 의존하고 있다.

**7.** 이는 본 paper의 가장 약한 고리다. Synthesis backbone이 환경·task·verification script를 모두 합성하므로 14B agent가 학습 가능한 task의 상한은 사실상 GPT-OSS-120B가 *명시 가능하고 verify 가능한* 행동 집합으로 제한된다 — 즉 "120B가 풀 줄은 모르지만 채점은 할 수 있는" 영역까지가 진정한 expansion 여지이고, 이 gap이 14B의 ceiling이 된다. 진정한 self-improvement인지 distillation인지 분리하려면 (i) **verifier-generator gap test**: GPT-OSS-120B를 동일 환경에서 zero-shot agent로 평가해 14B가 그 점수를 *초과*하는지, (ii) **backbone-swap ablation**: 합성 backbone을 더 약한 모델(예: 32B)로 교체했을 때 14B의 ceiling이 함께 내려가는지, (iii) **novel-tool held-out**: 합성 시 한 번도 등장하지 않은 MCP server에서 일반화되는지의 세 가지가 필요하다. 여기에 한 층 더해 "stronger proprietary baseline 추월" 클레임의 비교 모델이 GPT-5/Claude의 어느 버전·어느 평가 시점인지 고정되지 않으면, ceiling 논의 자체가 "어떤 ceiling을 넘었는가"를 정의할 수 없게 된다 — 즉 backbone ceiling 검증과 SOTA 클레임 검증은 같은 방법론적 결함의 두 얼굴이다. 논문이 GPT-OSS-120B 자체의 23-bench 점수를 baseline으로 명시하지 않은 것은 이 ceiling 분석을 의도적·비의도적으로 회피한 결과로 읽히며, "working in progress" 단계에서 가장 먼저 보강돼야 할 실험이다.
