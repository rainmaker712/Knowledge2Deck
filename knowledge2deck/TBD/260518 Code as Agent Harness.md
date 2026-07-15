[Code as Agent Harness: Toward Executable, Verifiable, and Stateful Agent Systems](https://arxiv.org/abs/2605.18747)

Xuying Ning, Katherine Tieu, Dongqi Fu, Tianxin Wei, Zihao Li, Yuanchen Bei et al., Hanghang Tong, Jingrui He (University of Illinois Urbana-Champaign, Meta, Stanford University)

> Recent large language models (LLMs) have demonstrated strong capabilities in understanding and generating code, from competitive programming to repository-level software engineering. In emerging agentic systems, code is no longer only a target output. It increasingly serves as an operational substrate for agent reasoning, acting, environment modeling, and execution-based verification. We frame this shift through the lens of *agent harnesses* and introduce *code as agent harness*: a unified view that centers code as the basis for agent infrastructure. To systematically study this perspective, we organize the survey around three connected layers. First, we study the *harness interface*, where code connects agents to reasoning, action, and environment modeling. Second, we examine *harness mechanisms*: planning, memory, and tool use for long-horizon execution, together with feedback-driven control and optimization that make harness reliable and adaptive. Third, we discuss *scaling the harness* from single-agent systems to multi-agent settings, where shared code artifacts support multi-agent coordination, review, and verification. Across these layers, we summarize representative methods and practical applications of *code as agent harness*, spanning coding assistants, GUI/OS automation, embodied agents, scientific discovery, personalization and recommendation, DevOps, and enterprise workflows. We further outline open challenges for harness engineering, including evaluation beyond final task success, verification under incomplete feedback, regression-free harness improvement, consistent shared state across multiple agents, human oversight for safety-critical actions, and extensions to multimodal environments. By centering code as the harness of agentic AI, this survey provides a unified roadmap toward executable, verifiable, and stateful AI agent systems.

<!-- Panel Verdict: CONDITIONAL -->
<!-- Metaphor: 무대 뒤 스태프 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

LLM은 무대 위의 배우다. 그런데 이 배우는 독백만 한다. 조명도, 세트도, 소품도 없는 맨바닥 무대에서 혼자 대사를 읊조리는 형국이다. 장면 전환(state management)을 해줄 스태프가 없으니 매 장면이 단절되고, 소품을 건네줄 사람(tool use)이 없으니 빈손으로 연기하며, 큐 시트(planning)를 잡아줄 무대감독 없이 즉흥으로 공연을 이어간다. 그동안 연구 커뮤니티는 배우의 연기력(model capability) — 파라미터 수, 학습 데이터, alignment — 만 논의해왔다. 하지만 이 서베이의 핵심 주장은 더 급진적이다: 배우를 agent로 만드는 것은 연기력 자체가 아니라 무대 뒤 스태프다. 스태프 없이는 공연이 성립하지 않는다. 코드가 단순한 대사(output)가 아니라 무대 자체를 구성하는 인프라(operational substrate) — 실행 가능하고(executable), 검증 가능하고(verifiable), 상태를 유지하는(stateful) 매체 — 라는 관점의 전환이 이 서베이의 출발점이다. 결정적 문제: 100편 넘는 논문이 각각 스태프 역할을 독립적으로 재발명해왔지만, 통합된 스태프 조직도(unified taxonomy)가 존재하지 않았다.

### 어떻게 푸는가 (Method)

이 서베이는 100편 이상의 논문을 하나의 극장 스태프 조직도, 즉 three-layer taxonomy로 정리한다. 조직도의 핵심은 각 스태프가 어떻게 연쇄적으로 협력하는가에 있다.

**Layer 1 — Harness Interface (무대-객석 경계 스태프).** 배우의 내면과 외부 세계를 잇는 접점이다. 프롬프터(reasoning interface)는 배우가 복잡한 계산이 필요할 때 대본 옆에서 코드 기반 추론 경로를 열어준다 — PAL과 PoT가 자연어를 실행 가능한 프로그램으로 변환하고, formal verification이 추론의 논리적 정합성을 사후 검증한다. 무대감독(acting interface)은 배우의 의도를 물리적 동작으로 번역한다 — SayCan이 환경 내 실행 가능성을 필터링하고, Voyager가 skill library를 통해 복합 행동 시퀀스를 조율하며, tool-calling이 외부 API와의 상호작용을 중개한다. 세트 디자이너(environment interface)는 배우가 실제로 연기할 수 있는 무대 환경을 구축한다 — sandbox, code interpreter, WebArena 같은 실행 환경이 이에 해당한다. 프롬프터가 열어준 추론 결과를 무대감독이 행동으로 옮기고, 그 행동이 세트 디자이너의 환경 위에서 실행되는 연쇄가 Layer 1의 작동 방식이다.

**Layer 2 — Harness Mechanism (공연 중 운영 스태프).** 막이 오른 뒤 실시간으로 공연을 지탱하는 인력이다. 스크립트 슈퍼바이저(memory)는 episodic log와 semantic index로 이전 장면의 맥락을 보존하고, 안무가(planning)는 code-based decomposition과 tree-search로 다음 장면 시퀀스를 설계한다. 소품 담당(tool use)은 function calling과 MCP를 통해 필요한 도구를 적시에 무대 위로 올리고, 연출가(control)는 self-debugging과 Reflexion으로 공연 중 실수를 감지해 장면을 되감는다. 리허설 코디네이터(optimization)는 매 공연의 execution feedback을 수집해 다음 회차의 전략을 개선한다. 여기서 핵심 연쇄는: 안무가가 계획을 짜면 → 소품 담당이 도구를 준비하고 → 스크립트 슈퍼바이저가 결과를 기록하며 → 연출가가 오류를 교정한 뒤 → 코디네이터가 전체를 최적화하는 순환이다.

**Layer 3 — Scaling (멀티캐스트 프로덕션).** 배우가 여럿일 때의 문제다. multi-agent 시스템에서 여러 agent가 shared state, delegation protocol, 공유 무대 인프라를 통해 하나의 프로덕션으로 결합된다. 한 배우의 퇴장이 다른 배우의 입장 큐가 되고, 한 agent의 코드 수정이 다른 agent의 실행 환경에 즉시 반영되는 동기화가 이 계층의 핵심이다.

### 무엇을 얻었나 (Result)

이 조직도의 가장 큰 기여는 가시화다. 100편 이상의 논문이 하나의 스태프 배치도 위에 자리를 잡으면, 그동안 보이지 않던 패턴이 드러난다. PAL과 PoT는 프롬프터였고, Voyager는 소품 담당과 스크립트 슈퍼바이저를 겸임했으며, SayCan은 무대감독이었고, Reflexion은 연출가였다. 각 극단이 독립적으로 같은 직책을 재발명해왔다는 사실이 조직도 하나로 명확해진다. 동시에, 아직 채워지지 않은 일곱 개의 빈 포지션(open challenges)이 드러난다 — harness-level evaluation(공연 전체의 품질 평가 체계), semantic verification(대사의 의미적 정합성 검증), self-evolving harnesses without regression(스태프가 스스로 성장하되 기존 역량을 잃지 않는 메커니즘), transactional shared state(다중 배우 간 안전한 상태 공유), human-in-the-loop safety(관객 개입 프로토콜), multimodal harness(시각·청각·텍스트를 아우르는 무대장치), 그리고 science of harness engineering(스태프 운영 자체의 공학적 원리)이다. 이 빈자리들이 곧 향후 연구 로드맵이 된다.

### 비유가 깨지는 지점 (Limit)

이 서베이의 한계는 비유 안에서도 선명히 드러난다. 첫째, 이것은 스태프 조직도(taxonomy)이지 연출 매뉴얼(engineering specification)이 아니다. 어떤 스태프 배치가 어떤 공연에서 최적인지에 대한 실증적 검증(empirical validation)이 없다. 프롬프터와 무대감독을 동시에 배치하면 효과가 배가되는지, 오히려 간섭이 생기는지, 이 조직도는 답하지 않는다. 둘째, 현실 극장에서는 배우와 스태프가 다른 사람이지만, 여기서는 배우도 LLM이고 스태프도 LLM이다. 스태프의 역량이 결국 배우의 역량에 묶이는 순환성(circularity) — harness가 아무리 정교해도 underlying model의 한계를 초월할 수 없다는 근본적 제약이 taxonomy 밖에 놓여 있다. 셋째, 일곱 개 도메인(coding, GUI, embodied, scientific, personalization, DevOps, enterprise)을 모두 커버하지만, 각 도메인의 깊이가 전문 서베이에 미치지 못한다 — 넓이를 위해 깊이를 희생한 전형적 tradeoff다. 넷째, 일곱 개 미충원 포지션은 문제 카탈로그일 뿐 구체적 해결책을 제시하지 않는다 — 빈자리를 지목했지만, 그 자리를 채울 오디션 기준은 후속 연구의 몫으로 남겨둔다.
