[Optimal Sparsity of Mixture-of-Experts Language Models for Reasoning Tasks](https://arxiv.org/abs/2508.18672)

Taishi Nakamura, Satoki Ishikawa, Masaki Kawamura, Takumi Okamoto, Daisuke Nohara, Jun Suzuki, Rio Yokota

*(ICLR 2026 Oral)*

> This paper investigates how MoE sparsity affects reasoning vs. memorization tasks differently. The core finding: models with identical training loss but greater active compute achieve higher reasoning accuracy. Reasoning tasks exhibit a non-monotonic (inverted-U) relationship with tokens-per-parameter (TPP), peaking near 20 TPP before degrading — while memorization scales monotonically with total parameters. Neither RL post-training nor test-time compute eliminates the sparsity-induced reasoning gap.

- **Two Principles for MoE Scaling**: (1) **Active FLOPs Principle** — given equal training loss, more active parameters (higher top-k) wins on reasoning. Training loss alone is insufficient as a proxy for downstream reasoning quality. (2) **TPP Principle** — reasoning performance is non-monotonic in tokens-per-parameter: too few tokens per parameter (excess params) or too many (insufficient data per param) both hurt. Optimal TPP for reasoning ≈ 20.

- **Reasoning vs. Memorization Diverge Fundamentally**: Memorization (TriviaQA, HellaSwag) improves monotonically with more total parameters and tolerates high sparsity. Reasoning (GSM8K, GSM-Plus, HumanEval, MBPP) shows a U-shaped loss curve — accuracy can degrade despite better pre-training loss when too many experts are added without proportionally more data or active compute.

- **Same Loss ≠ Same Capability**: This is the key challenge for MoE practitioners. Two models can achieve identical perplexity/loss with very different active FLOP budgets, but their reasoning capabilities diverge significantly. Pre-training loss is not a sufficient optimization target when reasoning is the goal.

- **Optimal Sparsity is Compute-Regime Dependent**: At low compute budgets, sparser models are preferred across all tasks. At high compute budgets with reasoning goals, denser configurations (more active experts) outperform despite the apparent efficiency cost.

- **RL and Test-Time Compute Don't Fix the Gap**: Applying GRPO or self-consistency sampling improves overall performance but preserves the inverted-U relationship. Sparsity-induced reasoning deficits can't be patched post-hoc — they must be addressed during architecture and data planning.

- **Practical Design Implication**: Joint optimization of three factors is required: (1) total parameters, (2) active parameters per token (top-k), and (3) training data per parameter (TPP). Sweeping only one dimension (e.g., adding more experts for "free" params) while holding the others fixed can actively harm reasoning performance.
