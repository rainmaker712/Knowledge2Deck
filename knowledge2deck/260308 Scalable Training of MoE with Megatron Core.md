[Scalable Training of Mixture-of-Experts Models with Megatron Core](https://arxiv.org/abs/2603.07685)

Zijie Yang, Juney Liu, Jiayi Liu et al. (NVIDIA, 45 authors)

> This technical report addresses the fundamental systems challenges in scaling MoE model training. MoE's sparsity creates a "parameter-compute mismatch" where total parameters grow much faster than per-token computation, coupling constraints across memory, communication, and compute that don't exist in dense models. The framework resolves these through integrated optimizations — fine-grained recomputation and offloading for memory, DeepEP/HybridEP dispatchers for communication, and Grouped GEMM/CUDA Graphs for compute — achieving 1,233 TFLOPS/GPU for DeepSeek-V3-685B on GB300 and 974 TFLOPS/GPU for Qwen3-235B on GB200.

- **The Three Walls Framework**: Every MoE scaling decision must be evaluated against three simultaneous constraints: (1) **Memory Wall** — all E experts' parameters, gradients, and optimizer states must fit in memory despite only K activating per token; (2) **Communication Wall** — all-to-all collectives for token routing grow with EP degree while per-token compute stays small; (3) **Compute Efficiency Wall** — small expert GEMMs severely underutilize GPU hardware, with routing overhead adding ~9% latency even after optimization.

- **Parallel Folding — Breaking EP Constraints**: The key parallelism innovation decouples attention and MoE layer parallelism configurations. Traditional approaches constrain Expert Parallelism ≤ Data Parallelism; Parallel Folding breaks this, enabling flexible EP degrees tailored per-architecture and per-hardware topology.

- **Communication is the Bottleneck**: Unoptimized all-to-all can consume up to **60% of total training time** for architectures like DeepSeek-V3. The optimized dispatcher (DeepEP/HybridEP) with communication-computation overlap is the highest-leverage fix.

- **Reduced Precision Hits All Three Walls at Once**: FP8/FP4 training simultaneously reduces activation memory, halves communication volume, and accelerates tensor ops via hardware support. This is why native low-precision pretraining (like NVFP4 in Nemotron 3 Super) is worth the complexity.

- **Compute Profile Shift in MoE**: In dense models, GEMMs account for ~70% of execution time (Llama-405B). In MoE models, this drops to under 50% (DeepSeek-V3). The optimization target fundamentally shifts from compute to routing and communication.

- **Key Benchmarks**: DeepSeek-V3-685B → 1,233/1,048 TFLOPS/GPU (GB300/GB200); Qwen3-235B → 974/919 TFLOPS/GPU (GB200/H100). Both validated at cluster scale across thousands of GPUs.

- **Production-Ready Features**: Distributed checkpointing with flexible resharding, RL post-training support (variable seq lengths, online weight export via Megatron-Bridge), LatentMoE integration, Muon optimizer, and ECHO (Elastic Cloning for Hot Experts) for load balancing without token dropping.

## Follow-Up Questions

1. The paper describes a "parameter-compute mismatch" as the root cause of MoE scaling challenges. How does this mismatch specifically manifest when comparing memory requirements, communication patterns, and compute utilization between dense models and MoE models of equivalent total parameter counts?

2. Parallel Folding decouples attention and MoE layer parallelism configurations, breaking the constraint that Expert Parallelism ≤ Data Parallelism. What system-level trade-offs does this introduce, and under what hardware topology conditions does this decoupling provide the most benefit?

3. The paper states that unoptimized all-to-all communication can consume up to 60% of total training time for DeepSeek-V3. What is the mechanism by which the DeepEP/HybridEP dispatcher with communication-computation overlap achieves its efficiency gains, and what are the remaining bottlenecks after this optimization?

4. In dense models, GEMMs account for ~70% of execution time, but this drops below 50% in MoE models. What implications does this compute profile shift have for hardware co-design and for practitioners choosing between dense and MoE architectures for a given workload?

5. ECHO (Elastic Cloning for Hot Experts) addresses load imbalance without token dropping. How does this approach compare to auxiliary load-balancing losses used during training, and what are the limitations of each approach at scale?

6. The framework achieves 1,233 TFLOPS/GPU for DeepSeek-V3-685B on GB300. To what extent are these benchmarks transferable to non-NVIDIA hardware or alternative communication fabrics, and what aspects of the optimization are most hardware-specific?

7. The paper integrates support for RL post-training with variable sequence lengths and online weight export. What new challenges does RL post-training introduce into the three-walls framework (memory, communication, compute), and how does Megatron Core's architecture address them compared to standard SFT?
