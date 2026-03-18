[Mid-Training of Large Language Models: A Survey](https://arxiv.org/abs/2510.06826)

Kaixiang Mo, Yuxin Shi, Weiwei Weng, Zhiqiang Zhou, Shuman Liu, Haibo Zhang, Anxiang Zeng

> This survey examines mid-training—the intermediate phase between pretraining and fine-tuning—as a distinct and structured discipline in LLM development. The authors define mid-training as multiple annealing-style phases that refine data quality, adapt optimization schedules, and extend context length. The work presents the first comprehensive taxonomy organizing mid-training approaches across three dimensions: data distribution, learning-rate scheduling, and long-context extension. It compiles benchmarks, practical guidance, and performance metrics while grounding the methodology in theory (gradient noise scale, information bottleneck, curriculum learning).

- **Three-Dimensional Taxonomy**: The paper organizes all mid-training techniques into three orthogonal axes — (1) **Data Distribution** (corpus curation, domain mixing, curriculum learning), (2) **LR Scheduling** (warmup, annealing, cyclic schedules tuned for continued training), and (3) **Long-Context Extension** (position interpolation, NTK-aware RoPE scaling). This is a clean mental model for thinking about the mid-training design space.

- **Data Quality > Quantity**: During mid-training, curating high-quality, domain-relevant data matters far more than raw token count. Curriculum progression (easy → hard) and domain balance are critical to avoiding catastrophic forgetting.

- **Conservative LRs**: Learning rates during mid-training should be significantly lower than pretraining rates. Aggressive LRs destabilize existing knowledge; careful warmup + annealing is the standard recipe.

- **Long-Context is Viable but Tricky**: Context window extension via RoPE adjustments (position interpolation, NTK-aware scaling) works well but requires empirical validation before committing to a full training run. Don't assume it generalizes cleanly across architectures.

- **Theoretical Grounding**: The survey ties mid-training effectiveness to three mechanisms — gradient noise scale (explains training stability), information bottleneck (explains generalization gains), and curriculum learning (explains knowledge progression). Useful frame for understanding *why* it works, not just *how*.

- **Real-World Validation**: Phi, DeepSeek, Qwen, OLMo, and Llama all employ mid-training strategies — this is now standard practice for frontier models, not an edge case.
