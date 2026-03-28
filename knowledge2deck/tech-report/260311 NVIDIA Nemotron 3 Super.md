[NVIDIA Nemotron 3 Super Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Super-Technical-Report.pdf)

NVIDIA Corporation (357 authors; see arXiv:2512.20856)

> Nemotron 3 Super is a 120B total / 12B active parameter Mixture-of-Experts hybrid Mamba-Transformer model designed to deliver agentic, reasoning, and conversational capabilities at high inference efficiency. It supports context lengths up to 1M tokens and is the first Nemotron model trained natively in NVFP4 precision from the start. The model targets agentic workflows requiring multi-step reasoning, tool use, and long-range memory, delivering 2.2x–7.5x higher inference throughput than comparable-accuracy models.

- **Architecture — Three Innovations Combined**: (1) **LatentMoE** — token embeddings are projected into a lower-rank latent space before expert routing, activating 22 of 512 experts per token at 4x lower routing cost; (2) **Mamba-2 Hybrid** — 88 layers interleave Mamba-2 (linear-time SSM, 4x memory efficiency), Transformer attention (precise retrieval), and LatentMoE layers; (3) **Multi-Token Prediction (MTP)** — shared-weight design that predicts multiple future tokens simultaneously, enabling native speculative decoding for up to 3x wall-clock speedup.

- **Training Pipeline — 4 Stages**: (0) Pretraining on 25T tokens via a two-phase curriculum (20T diversity-heavy → 5T quality-heavy) + two long-context stages up to 1M tokens; (1) SFT on ~7M samples across 15+ domains; (2) RL with async GRPO across 21 environment configurations / 1.2M rollouts; (3) Post-training quantization to FP8 and NVFP4.

- **Checkpoint Merging as Mid-Training**: During the stable LR phase, weighted averaging over a sliding window of recent checkpoints improved the 12-benchmark average by **2–4 points while saving ~16% of total compute** — a clean efficiency win worth replicating.

- **NVFP4 Native Pretraining**: Training all linear layers in 4-bit floating point from the start (not post-hoc quantization), with select stability-sensitive layers (QKV, embeddings, latent projections) kept in BF16/MXFP8. Delivers 3x higher throughput than FP8 on Blackwell (GB300). Key finding: switching to MXFP8 before LR annealing improved loss but gave no downstream accuracy gain — confirming NVFP4 parity holds end-to-end.

- **Key Benchmarks**: AIME 2025 90.2%, HMMT Feb25 95.4% (w/ tools), GPQA 82.7% (w/ tools), LiveCodeBench v5 81.2%, SWE-Bench Verified 60.5%, RULER @ 1M tokens 91.75%, TauBench V2 avg 60.5%.

- **The "Thinking Tax" Problem**: Chaining many reasoning steps in multi-agent systems accumulates enormous token budgets. The LatentMoE + Mamba combo directly attacks this — same reasoning depth, far lower per-token compute cost. This is the core design thesis of the model.

- **RL > RLHF for Agentic Capability**: Multi-environment RL across 21 configurations (math, coding, SWE, tool use, search, chat) with 1.2M rollouts is what produces robust agentic behavior — narrow RLHF alone doesn't get there.

## Follow-Up Questions

1. LatentMoE projects token embeddings into a lower-rank latent space before expert routing, reducing routing cost by 4x while still activating 22 of 512 experts. Why does projecting into a latent space before routing reduce cost, and what information might be lost in this projection that could affect which experts get selected?

2. The Mamba-2 hybrid interleaves SSM layers, Transformer attention layers, and LatentMoE layers across 88 total layers. How do the paper's designers determine the optimal ratio and placement of these three layer types — is this empirically searched or theoretically motivated?

3. Checkpoint merging during the stable LR phase (sliding window weighted averaging) improved performance by 2-4 benchmark points while saving 16% compute. What is the mechanistic explanation for why averaging checkpoints during training improves generalization, and why is this effect strongest during the stable LR phase rather than the warmup or decay phases?

4. Nemotron 3 Super is the first model trained natively in NVFP4 (4-bit floating point) from the start. What stability challenges arise from training in such low precision, and why are QKV projections, embeddings, and latent projections specifically kept in higher precision (BF16/MXFP8)?

5. The "Thinking Tax" problem is identified as a core motivation for the architecture: multi-agent reasoning chains accumulate massive token budgets. How does the LatentMoE + Mamba combination specifically reduce per-token compute without reducing reasoning depth, and is there a quantitative relationship between the compute savings and the depth of reasoning that can be sustained?

6. RL across 21 environment configurations with 1.2M rollouts is credited for robust agentic behavior over narrow RLHF. What properties of multi-environment RL training lead to more general capability — is it the diversity of reward signals, the forced exploration across different task structures, or the sheer scale of rollouts?

7. The model achieves 91.75% on RULER at 1M token context. What specific architectural features enable reliable information retrieval at this extreme context length, and what are the known failure patterns of hybrid Mamba-Transformer models when the relevant information is distributed across very long contexts rather than concentrated locally?