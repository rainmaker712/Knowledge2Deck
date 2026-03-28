[260113 Conditional Memory via Scalable Lookup: A New Axis of Sparsity for Large Language Models](https://www.arxiv.org/abs/2601.07372)

Authors: Xin Cheng, Wangding Zeng, Damai Dai, Qinyu Chen, Bingxuan Wang, Zhenda Xie, Kezhao Huang, Xingkai Yu, Zhewen Hao, Yukun Li, Han Zhang, Huishuai Zhang, Dongyan Zhao, Wenfeng Liang

> While Mixture-of-Experts (MoE) scales capacity via conditional computation, Transformers lack a native primitive for knowledge lookup, forcing them to inefficiently simulate retrieval through computation. To address this, we introduce conditional memory as a complementary sparsity axis, instantiated via Engram, a module that modernizes classic N-gram embedding for O(1) lookup. By formulating the Sparsity Allocation problem, we uncover a U-shaped scaling law that optimizes the trade-off between neural computation (MoE) and static memory (Engram). Guided by this law, we scale Engram to 27B parameters, achieving superior performance over a strictly iso-parameter and iso-FLOPs MoE baseline. Most notably, while the memory module is expected to aid knowledge retrieval (e.g., MMLU +3.4; CMMLU +4.0), we observe even larger gains in general reasoning (e.g., BBH +5.0; ARC-Challenge +3.7) and code/math domains~(HumanEval +3.0; MATH +2.4). Mechanistic analyses reveal that Engram relieves the backbone's early layers from static reconstruction, effectively deepening the network for complex reasoning. Furthermore, by delegating local dependencies to lookups, it frees up attention capacity for global context, substantially boosting long-context retrieval (e.g., Multi-Query NIAH: 84.2 to 97.0). Finally, Engram establishes infrastructure-aware efficiency: its deterministic addressing enables runtime prefetching from host memory, incurring negligible overhead. We envision conditional memory as an indispensable modeling primitive for next-generation sparse models.

***
- Reasoning 과 Knowldege를 Decoupling하는 방식으로 접근
- O(n)과 성능에 대한 명확한 이점
## Follow-Up Questions

1. Engram introduces O(1) lookup as a "conditional memory" primitive separate from neural computation. Why does the standard Transformer architecture lack an efficient native knowledge retrieval mechanism, and what computational properties of attention make it a poor substitute for direct lookup?

2. The paper proposes the "Sparsity Allocation" problem and finds a U-shaped scaling law between neural computation (MoE) and static memory (Engram). What does the U-shape imply about the relationship between these two forms of capacity — is there a principled reason why both extremes (pure MoE and pure static memory) are suboptimal?

3. Engram shows unexpected gains in reasoning and code/math (+5.0 BBH, +3.0 HumanEval) beyond the expected knowledge retrieval improvements. The mechanistic explanation is that it "relieves early layers from static reconstruction." What does this mean concretely, and why would freeing early layers improve complex reasoning rather than just factual recall?

4. By "delegating local dependencies to lookups," Engram frees attention capacity for global context, leading to gains on long-context retrieval (NIAH: 84.2 → 97.0). What is the distinction between "local" and "global" dependencies in this context, and why is attention particularly ill-suited to handle local n-gram-style dependencies efficiently?

5. Engram uses "deterministic addressing" to enable runtime prefetching from host memory. What makes deterministic addressing possible for a learned lookup module, and how does this differ from the non-deterministic access patterns of standard attention or sparse MoE routing?

6. The paper scales Engram to 27B parameters and achieves better performance than an iso-parameter, iso-FLOPs MoE baseline. What does "iso-FLOPs" mean in this comparison, and why is it important to control for both parameters and FLOPs separately when evaluating a new sparsity axis?

7. What are the key limitations of the conditional memory approach — for instance, how does Engram handle knowledge that requires contextual interpretation (e.g., polysemous words), and what types of reasoning tasks would you expect it to fail on even with a very large memory?
