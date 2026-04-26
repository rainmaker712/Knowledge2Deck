[Towards Agentic Self-Learning LLMs in Search Environment](https://arxiv.org/abs/2510.14253)

Wangtao Sun, Xiang Cheng, Jialin Fan, Yao Xu, Xing Yu, Shizhu He, Jun Zhao, Kang Liu

> We study whether self-learning can scale LLM-based agents without relying on human-curated datasets or predefined rule-based rewards. Through controlled experiments in a search-agent setting, we identify two key determinants of scalable agent training: the source of reward signals and the scale of agent task data. We find that rewards from a Generative Reward Model (GRM) outperform rigid rule-based signals for open-domain learning, and that co-evolving the GRM with the policy further boosts performance. Increasing the volume of agent task data-even when synthetically generated-substantially enhances agentic capabilities. Building on these insights, we propose Agentic Self-Learning (ASL), a fully closed-loop, multi-role reinforcement learning framework that unifies task generation, policy execution, and evaluation within a shared tool environment and LLM backbone. ASL coordinates a Prompt Generator, a Policy Model, and a Generative Reward Model to form a virtuous cycle of harder task setting, sharper verification, and stronger solving. Empirically, ASL delivers steady, round-over-round gains, surpasses strong RLVR baselines (e.g., Search-R1) that plateau or degrade, and continues improving under zero-labeled-data conditions, indicating superior sample efficiency and robustness. We further show that GRM verification capacity is the main bottleneck: if frozen, it induces reward hacking and stalls progress; continual GRM training on the evolving data distribution mitigates this, and a small late-stage injection of real verification data raises the performance ceiling. This work establishes reward source and data scale as critical levers for open-domain agent learning and demonstrates the efficacy of multi-role co-evolution for scalable, self-improving agents.

## Key Contributions

- Identifies **reward-signal source** and **agent-task-data scale** as the two critical levers for scalable agent self-training.
- Shows that **Generative Reward Models (GRM)** outperform rule-based rewards in open-domain search agents, and that **co-evolving** the GRM with the policy is strictly better than freezing it.
- Proposes **ASL (Agentic Self-Learning)**: closed-loop, multi-role RL framework where Prompt Generator, Policy Model, and GRM co-evolve in a single shared environment.
- Diagnoses GRM verification capacity as the **primary bottleneck** — frozen GRMs trigger reward hacking. Late-stage injection of ~1% real verification data lifts the performance ceiling.

## Method / Architecture

Three roles, one LLM backbone, shared tool environment:

**1. Prompt Generator**
- Synthesizes training tasks with adaptive difficulty tuned by policy feedback.
- Uses **entropy** of the policy's answers as a difficulty signal — targets prompts in the intermediate entropy band.

**2. Policy Model (Solver)**
- Executes agent rollouts in the search environment (calling tools, retrieving, reasoning).
- Receives scalar correctness scores from the GRM; trained via RL on those rewards.

**3. Generative Reward Model (GRM)**
- Replaces rule-based exact-match or regex checkers with an LLM judge that produces verifications + rationales.
- Critically, the GRM is **trained continually** on the evolving self-generated data distribution to prevent blind-spot exploitation.

**Optimization cycle:** Generator → GRM → Policy → Generator, each round sharpening the others. A late-stage **~1% real verification data injection** recalibrates the GRM and unlocks the next performance tier.

## Results

- **vs. Search-R1 (RLVR baseline):** ASL keeps gaining round-over-round; Search-R1 plateaus then degrades.
- **vs. Absolute Zero Reasoner / R-Zero:** ASL sustains progress past the point where those stall.
- **Zero-labeled-data regime:** ASL continues improving; rule-based RLVR does not.
- **Frozen GRM ablation:** reward hacking emerges, policy plateaus — confirming that GRM co-evolution is necessary, not optional.

## Takeaways

- **The verifier is the bottleneck, not the solver.** If reward signals stop tracking truth, self-play collapses regardless of policy capacity.
- **Synthetic task scale matters** — agentic capability gains are driven as much by *volume* of self-generated tasks as by label quality.
- **Minimal real data has outsized leverage**: 1% real verification samples can reset the ceiling, suggesting a mostly-autonomous pipeline with rare human touchpoints is practical.
- **Search-agent domain specifics**: results depend on a tool environment (retrieval + reasoning). Generality to non-search agents is not yet demonstrated.

## Follow-Up Questions

1. How does ASL avoid the classic failure mode where the Prompt Generator learns to probe the GRM's blind spots rather than generate genuinely useful tasks?
2. The GRM and Policy share an LLM backbone. Does parameter sharing cause the judge's blind spots to correlate with the policy's blind spots, amplifying rather than correcting errors?
3. What exactly is being optimized when the GRM is "continually trained on the evolving data distribution" — and what supervision signal does it use given the closed-loop setup?
4. How does ASL compare to Self-Aware RL (2510.02752) — both use closed-loop self-play with bounded external data, but ASL's novelty is the GRM role. Are they complementary or redundant?
5. Why does Search-R1 (RLVR) degrade rather than plateau? Is it overfitting to verifier quirks, or something else?
6. The 1% real-verification injection lifts the ceiling — but would injecting 1% real *task* data be even more effective? What's the marginal value per dimension?
7. Entropy-as-difficulty is elegant but hackable (a model can produce high-entropy garbage). How is the signal kept honest?

## Answers

**1.** The paper's defense is continual GRM training on the evolving distribution — as the Generator discovers a blind spot, the GRM sees those new samples and adapts its judgment. This is a race condition more than a guarantee: if the Generator explores faster than the GRM can update, reward hacking wins. The reported frozen-GRM ablation shows this failure mode in action. The 1% real-data injection is effectively a circuit breaker — external ground truth re-anchors the GRM when drift accumulates. Residual risk: if the Generator learns adversarial prompts faster than GRM retraining can keep up between injections.

**2.** Shared-backbone judging is indeed risky — if the policy can't solve a problem, the judge (same weights) may also mis-evaluate it. The paper frames GRM training as a separate optimization trajectory, but mechanistically they are fine-tunes of the same base. The saving grace is that judging is typically easier than solving (verification < generation for most tasks), so even a shared backbone may retain judge-better-than-solver behavior for a while. The 1% real data injection specifically targets this drift.

**3.** The GRM's supervision in the closed loop comes from the policy's rollout outcomes plus (sparingly) real verification data. Concretely: when the policy produces a trajectory, the GRM's old judgment can be compared against whatever external signals are available (tool outputs, consistency checks, rule-based partial checks, or periodic human-verified anchors). Without at least *some* ground-truth anchor, the GRM would drift freely — hence the 1% injection being presented as essential, not optional.

**4.** Complementary, not redundant. Self-Aware RL (2510.02752) focuses on the **proposer side**: the model self-predicts difficulty and requests external help only at its limit. ASL focuses on the **verifier side**: replace rigid checkers with a co-evolving LLM judge. You could plausibly combine them — a self-aware proposer with a co-evolving GRM judge — to address both the curriculum-selection and reward-signal-quality problems simultaneously. Each alone leaves the other half exposed.

**5.** Search-R1 uses RLVR with rule-based rewards in a search domain where ground truth is ambiguous (multiple valid answers, partial matches). Rule-based rewards that don't track true correctness create a bias gradient: the policy learns to exploit regex quirks rather than solve the task, which eventually degrades performance as the exploits crowd out real skill. ASL's GRM mitigates this because LLM judges can reason about semantic equivalence. Degradation (not plateau) is the tell that the reward signal is actively misleading.

**6.** Real-task injection and real-verification injection serve different purposes. Task injection widens coverage; verification injection recalibrates the judge. The paper's bottleneck finding ("GRM is the limit") implies verification is the binding constraint, so 1% there is higher marginal value than 1% task injection. In a saturated-verifier regime the answer would flip.

**7.** This is a real concern. The paper does not (in the extracted sections) provide a strong defense beyond the overall loop's self-correction dynamics — if the Generator emits high-entropy garbage, the policy will fail on it, the GRM will score low, and the Generator's reward for emitting such tasks should decrease *if* the generator reward is tied to policy learning progress rather than raw entropy. The precise reward shaping for the Generator is the crux here and deserves scrutiny in the full paper.
