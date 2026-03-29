# Agent Pre-training: Youtu-LLM vs Kimi K2 비교 분석

## 1. 각 논문의 Agent 데이터 투입 시점 정정

**Youtu-LLM은 Pre-training 초기가 아닌 최후반부입니다.**

4단계 커리큘럼:

Common Knowledge → STEM & Coding → Mid (Context Extension) → **Agentic Mid**

④ "Agentic Mid"는 최종 정렬 단계로, 전체 커리큘럼의 마지막입니다.

> "Introducing agentic data early would be analogous to teaching planning before the model has internalized the underlying knowledge..."

**Kimi K2는 이미 강력한 장문맥 LLM 위에 Agentic Mid-training을 수행하는 구조입니다.** 즉 두 논문 모두 "기초 능력 확립 → Agent 특화" 순서를 따르며, 차이는 베이스 모델의 규모와 Agent 훈련의 진입 시점입니다.

| 구분 | Youtu-LLM | Kimi K2 |
|------|-----------|---------|
| 모델 크기 | 1.96B (scratch) | Large (frontier급) |
| Agent 데이터 투입 | Pre-training 최후반 (Agentic Mid) | Mid-training (기성 LLM 위) |
| 방법론 | Curriculum + Synthetic Trajectories | RL + Synthetic + Human Rollout |

---

## 2. Agent Pre-training이 작동하는 원리

### 왜 순서가 중요한가?

Agent 능력은 계층적 의존성을 가집니다:

- 언어 이해 (사실 지식)
- 구조적 추론 (STEM, 코드)
- 계획 수립 (Planning under uncertainty)
- 행동-관찰 루프 (Tool Use, Reflection)

하위 레이어 없이 상위 레이어를 훈련하면 **포맷 모방(agentic formatting)은 배우지만 실제 인지 구조는 없는 모델**이 만들어집니다.

### Agent 훈련 데이터의 구조

| 카테고리 | 규모 | 구조 |
|----------|------|------|
| Agentic CoT | 25B | Analysis → Planning → Action → Reflection |
| Math Trajectory | 20B | Task → Context → Action 루프 |
| Code Execution | 70B | Task → Context → Action 루프 |
| Deep Research | 60B | 장기 리서치 궤적 |
| Tool Use | 25B | API 상호작용, Strategic Planning |

공통 패턴: **단순 QA가 아닌 Trajectory** — 상태 전이가 있는 시퀀스.

### Rewriting Paradigm (데이터 품질 핵심)

Raw CoT trajectory의 문제는 중복, 반복, 장황함입니다. 단순 필터링은 희귀한 추론 패턴까지 버려버리므로:

Raw Trajectory → Curation (핵심 논리 추출) → Synthesis (간결한 경로 재구성) → **Refined Trajectory**

이는 **데이터 복원**이며 필터링이 아닙니다. 불완전하지만 복구 가능한 궤적을 살려냅니다.

---

## 3. Agent Pre-training의 구조적 원칙

### ① 기초 견고화 우선 (Foundation First)

- Agentic 데이터는 세계 지식과 구조적 추론이 충분히 내재화된 후 투입
- 역순이면 catastrophic forgetting 없이도 표면적 패턴만 학습

### ② 훈련 신호의 3계층

- **Synthetic Trajectories** — 확장성, Oracle 능력 상한
- **Human Supervised Rollouts** — 품질 상한, 비용 큼
- **RL with Tool Feedback** — 실제 환경 적응, 느리지만 가장 현실적

Kimi K2 방식: 세 가지를 커리큘럼 내에서 결합

### ③ 단계별 오류 누적 문제

- 10-step 태스크에서 step당 5% 오류율 → 태스크 성공률 ~60%로 하락
- 따라서 **Process-level reward** (단계별 피드백)가 terminal reward보다 중요
- 이것이 Kimi K2가 RL을 활용하는 핵심 이유

### ④ 장문맥은 전제조건

- 긴 tool-use trajectory를 보유하려면 충분한 context window 필수
- Kimi의 long-context 선행 연구 → Kimi K2 Agentic 훈련의 architectural prerequisite
- Youtu-LLM도 MLA + 128k context로 이 문제를 해결

### ⑤ Agentic 데이터 비율

- Youtu-LLM: 1.96B 모델에 200B 토큰 → 총 토큰 대비 약 1.8%이지만 전용 단계로 집중
- 단순 혼합이 아닌 커리큘럼 내 격리된 단계로 투입하는 것이 key

---

## 4. 미해결 질문들

두 논문 모두 다루지 않는 열린 문제:

- **최적 비율은?** 전체 pre-training 대비 agentic 토큰의 비율 실험적 증거 부족
- **합성 데이터의 천장?** Oracle 모델 능력 이상의 agentic 행동을 합성 데이터로 가르칠 수 있는가
- **일반화 vs 특화 trade-off** — 200B 아젠틱 토큰이 일반 언어 능력을 얼마나 훼손하는가
- **환경 다양성** — 특정 tool API 포맷에 과적합 없이 새로운 tool로 전이 가능한가

---

> **요약:** 두 논문의 핵심 공통점은 "Agent 능력은 처음부터 주입하는 것이 아니라, 기초 인지 구조가 확립된 후 마지막 단계에서 집중적으로 투입된다"는 것입니다. Youtu-LLM은 이걸 scratch 모델로 검증했고, Kimi K2는 대형 모델에서 mid-training으로 수행했습니다.
