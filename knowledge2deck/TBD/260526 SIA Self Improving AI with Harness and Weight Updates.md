[SIA: Self Improving AI with Harness & Weight Updates](https://arxiv.org/abs/2505.27276)

Prannay Hebbar, Yogendra Manawat, Samuel Verboomen, Alesia Ivanova, Selvam Palanimalai, Kunal Bhatia, Vignesh Baskaran

> Humans are the bottleneck in building and improving AI. Both the models and the agents that wrap them are written, tuned, and corrected by people. The long-horizon goal of an AI that can figure out how to improve itself remains open. Two largely disjoint research lines attack this bottleneck. The harness-update school has a meta-agent rewrite the scaffold of a task-specific agent (its tools, prompts, retry logic, and search procedure) while the model weights are held fixed. The test-time training school uses hand-written RL pipelines to update the model's own weights on task feedback while the harness is held fixed. These two silos operate in isolation. We propose SIA, a self-improving loop in which a language-model agent (the Feedback-Agent) updates both the harness and the weights of a task-specific agent. We evaluate across three contrasting domains: Chinese legal charge classification, low-level GPU kernel optimisation, and single-cell RNA denoising. Combining both levers outperforms scaffold iteration alone on all three benchmarks. SIA-W+H achieves 25.1% over prior SOTA on LawBench, 12.4% faster GPU kernels than prior SOTA (1,017 vs 1,161 μs), and 20.4% over prior SOTA on denoising. Harness updates make the model agentic, shaping how it searches and acts, while weight updates build the domain intuition that no prompt or scaffold can instil.

<!-- Panel Verdict: CONDITIONAL -->
<!-- Metaphor: 공장 라인 개조 + 장인의 손기술 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

어느 제조 공장에서 생산성을 높이려면 두 가지 방법이 있다. 첫째는 생산 라인 자체를 개조하는 것 — 컨베이어벨트 속도, 도구 배치, 품질 검사 절차(scaffold)를 바꾸는 것이다. 둘째는 작업자의 몸에 밴 손기술(tacit skill)을 훈련하는 것 — 수년간 반복해야만 체득되는 감각적 판단력이다. 지금까지 두 개선팀은 완전히 분리되어 일해 왔다. harness-update 팀은 작업자 교체 없이 라인만 고치고, test-time training 팀은 라인 변경 없이 작업자만 재훈련한다. 두 팀은 서로의 변경 이력을 공유하지 않은 채, 교대로 공장에 들어와 각자의 방식대로 최적화한다. 그 결과 두 가지 개선 방법이 시너지를 내지 못하고, 한쪽이 만들어 놓은 환경을 다른 쪽이 무너뜨리는 일이 반복된다.

### 어떻게 푸는가 (Method)

SIA는 Feedback-Agent라는 공장 총감독을 도입한다. 총감독은 매 세대(generation)마다 세 가지를 관찰한다: 현재 생산 라인의 소스코드(scaffold Aₘ), 작업자가 남긴 작업 궤적(trajectory τₘ), 그리고 성과 지표(metrics ℰₘ). 이 정보를 바탕으로 총감독은 이번 개선이 라인 개조(H: harness update)인지 아니면 작업자 재훈련(W: weight update)인지를 스스로 결정한다. 라인 개조를 택하면 새로운 도구, 파서, retry 로직을 LLM이 직접 코드로 작성한다. 작업자 재훈련을 택하면 LoRA rank 32 어댑터를 RL로 학습한다 — 작업 궤적의 특성에 따라 다섯 가지 알고리즘 중 하나를 선택한다: 단계별 보상이 밀도 높을 때는 PPO+GAE, 저렴한 롤아웃과 에피소드 종료 보상에는 GRPO, 보상 분포가 오른쪽으로 치우쳐 있을 때는 Entropic advantage weighting, 기존 능력 보존이 필요한 밀도 높은 보상에는 REINFORCE+KL-to-base, 보상이 희소하거나 cold-start 상황에는 Best-of-N behavioral cloning. 다만 이 알고리즘 선택기(selector) 자체는 별도로 ablation되지 않았다 — 총감독이 실제로 매번 최적의 알고리즘을 고르는지, 아니면 특정 알고리즘에 편중되는지는 검증되지 않은 채로 남아 있다.

### 무엇을 얻었나 (Result)

세 개의 공장(도메인)에서 라인만 개조한 SIA-H보다 라인+작업자 재훈련을 병행한 SIA-W+H가 모두 우위를 보였다. 법률 분류 공장(LawBench, 191개 charge 분류)에서는 초기 불량률이 86.5%(정확도 13.5%)에서 출발해, 라인 개조만으로 50.0%에 도달했고, 작업자 재훈련(PPO+GAE)을 더하자 70.1%로 올라섰다 — 이전 SOTA 45.0% 대비 25.1%p 향상이다. GPU 커널 최적화 공장(TriMul)에서는 초기 처리 속도 점수 0.105에서 출발해, 라인 개조 후 0.120으로 거의 제자리였지만, 작업자 재훈련(Entropic advantage weighting)이 H100 특화 패턴(shared-memory tiling, fp32 accumulation)을 내재화하면서 1.475점(런타임 1,017 μs)으로 급도약했다 — 이전 SOTA 1,161 μs 대비 12.4% 빠르고, 라인 개조만의 최고치 12,483 μs와 비교하면 91.9% 단축이다. RNA 디노이징 공장(MAGIC)에서는 라인 개조가 하이퍼파라미터 탐색을 통해 mse_norm 0.241에서 멈췄는데, 작업자 재훈련(GRPO)이 np.clip + np.rint라는 두 줄짜리 후처리 — 생물학적 제약인 음수 불가·정수 강제를 구현하는 코드 — 를 스스로 발견해 0.289까지 끌어올렸다. 이 발견은 라인 개조 수십 세대 동안 한 번도 나타나지 않은 패턴이었다.

### 비유가 깨지는 지점 (Limit)

공장 비유에서 가장 크게 놓치는 지점은 "감독관 문제"다. 공장 비유에서는 생산성을 평가하는 외부 기준(시장 수요, 소비자 만족)이 라인 개조와 작업자 훈련과 독립적으로 존재한다고 암묵적으로 가정한다. 그러나 SIA에서 두 개선팀(H와 W)은 모두 같은 고정 verifier를 최적화 목표로 삼는다. 라인이 바뀌면 작업자가 보는 환경이 달라지고, 작업자가 바뀌면 라인의 효과가 달라진다 — 두 최적화기는 서로의 업데이트 이력을 모른 채 같은 감독관만 바라보며 움직이는 Nash equilibrium 상태에 빠진다. 이는 단일 최적화기의 Goodhart 문제와 구조적으로 다른 coupled co-evolutionary Goodhart로, 훈련 verifier에서는 강하지만 distribution shift에서 취약할 수 있다. 실험적 한계도 있다: Table 3의 수치에는 seed 분산이나 오차 범위가 보고되지 않았고, LawBench에서 45.0% → 70.1%(56% 상대 향상)라는 이례적 도약은 최적화 대상과 동일한 verifier에 대한 과적합 가능성을 배제하지 못한다. 또한 Feedback-Agent의 H/W 선택 및 RL 알고리즘 선택이 실제로 매번 최적인지를 검증하는 ablation이 없어, 성능 향상의 얼마만큼이 동적 선택 덕분인지는 알 수 없다.

## R3 Impact Review

**판정: +** (긍정적, 조건부)

SIA가 제시하는 "harness + weights 동시 개선" 루프는 기존 두 사일로(harness-update, test-time training)의 구조적 공백을 직접 메우며, 이 프레임 자체가 향후 self-improving agent 연구의 기본 기준선(baseline)이 될 가능성이 높다. LawBench +25.1%p, GPU 커널 12.4% 속도 향상, RNA 디노이징 +20.4%라는 수치는 세 개의 이질적 도메인에 걸쳐 재현되어 단일 도메인 과적합이 아님을 시사하며, 특히 GPU 커널 최적화에서의 91.9% 런타임 단축은 HPC 실무 적용 가능성을 열어둔다. 그러나 핵심 한계는 재현 불가능성으로, base model이 `openai/gpt-oss-120b`(proprietary)인 데다 Table 3에 seed 분산·오차 범위가 없어 독립적 검증이 불가능하다 — 이는 후속연구 커뮤니티가 이 결과 위에서 빌드하기 어렵게 만드는 가장 큰 장애물이다. Feedback-Agent의 RL 알고리즘 선택기(PPO/GRPO/EAW/REINFORCE+KL/BoN)에 대한 ablation이 없어 성능 향상의 기여 분해가 불명확하고, coupled co-evolutionary Goodhart(harness·weights가 동일 고정 verifier를 동시에 최적화) 문제는 OOD 시나리오에서의 로버스트니스에 의문을 남긴다. 오픈소스 base model + 분산 보고 + verifier independence 조건이 갖춰진 후속 구현이 등장한다면 실질적 파급력이 크게 상승할 수 있으나, 현재로서는 프레임워크의 개념적 기여가 실증적 신뢰성보다 앞서 있는 상태다.
