[How to Set the Learning Rate for Large-Scale Pre-training?](https://arxiv.org/abs/2601.05049)

Authors: Yunhua Zhou, Shuhao Xing, Junhao Huang, Xipeng Qiu, Qipeng Guo

> Optimal configuration of the learning rate (LR) is a fundamental yet formidable challenge in large-scale pre-training. Given the stringent trade-off between training costs and model performance, the pivotal question is whether the optimal LR can be accurately extrapolated from low-cost experiments. In this paper, we formalize this investigation into two distinct research paradigms: Fitting and Transfer. Within the Fitting Paradigm, we innovatively introduce a Scaling Law for search factor, effectively reducing the search complexity from O(n^3) to O(n*C_D*C_{\eta}) via predictive modeling. Within the Transfer Paradigm, we extend the principles of μTransfer to the Mixture of Experts (MoE) architecture, broadening its applicability to encompass model depth, weight decay, and token horizons. By pushing the boundaries of existing hyperparameter research in terms of scale, we conduct a comprehensive comparison between these two paradigms. Our empirical results challenge the scalability of the widely adopted μ Transfer in large-scale pre-training scenarios. Furthermore, we provide a rigorous analysis through the dual lenses of training stability and feature learning to elucidate the underlying reasons why module-wise parameter tuning underperforms in large-scale settings. This work offers systematic practical guidelines and a fresh theoretical perspective for optimizing industrial-level pre-training.
## Follow-Up Questions

1. The paper distinguishes between two research paradigms for optimal LR selection: Fitting and Transfer. What are the core assumptions underlying each paradigm, and in what practical circumstances would you prefer one over the other when planning a large-scale pre-training run?

2. The Fitting Paradigm introduces a Scaling Law for the search factor, reducing complexity from O(n^3) to O(n*C_D*C_η). What does this complexity reduction mean in concrete terms for a practitioner running hyperparameter sweeps, and what new predictive information does the scaling law capture that the brute-force approach does not?

3. The paper challenges the scalability of μTransfer at large scale. What specific mechanisms — related to training stability and feature learning — does the paper identify as causing μTransfer to underperform? Why would module-wise parameter tuning become less reliable as scale increases?

4. The authors extend μTransfer to MoE architectures, covering depth, weight decay, and token horizons. Why are these additional dimensions (beyond width, which μP originally addressed) particularly important for MoE models compared to dense transformers?

5. The paper finds that optimal LR is not simply transferable from small proxy models to large target models under all conditions. How does this finding affect the practical value of the "train small, transfer to large" paradigm for industrial pre-training teams, and what safeguards or validation steps would you recommend?

6. The paper frames LR optimization as a tension between training cost and model performance. How would you design an experiment to determine the optimal "proxy model budget" — the size of experiments you can afford to run before the transfer uncertainty makes further small-scale tuning pointless?

7. What are the key open questions this paper leaves unresolved, particularly regarding the stability of LR scaling laws across different data distributions, tokenizers, or training objectives beyond next-token prediction?
