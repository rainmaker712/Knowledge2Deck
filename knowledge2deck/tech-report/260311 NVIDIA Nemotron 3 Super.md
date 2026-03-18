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
