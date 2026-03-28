[How to Set the Batch Size for Large-Scale Pre-training?](https://arxiv.org/abs/2601.05034)

Authors: Yunhua Zhou, Junhao Huang, Shuhao Xing, Yechen Zhang, Runyu Peng, Qiping Guo, Xipeng Qiu

> The concept of Critical Batch Size, as pioneered by OpenAI, has long served as a foundational principle for large-scale pre-training. However, with the paradigm shift towards the Warmup-Stable-Decay (WSD) learning rate scheduler, we observe that the original theoretical framework and its underlying mechanisms fail to align with new pre-training dynamics. To bridge this gap between theory and practice, this paper derives a revised E(S) relationship tailored for WSD scheduler, characterizing the trade-off between training data consumption E and steps S during pre-training. Our theoretical analysis reveals two fundamental properties of WSD-based pre-training: 1) B_min, the minimum batch size threshold required to achieve a target loss, and 2) B_opt, the optimal batch size that maximizes data efficiency by minimizing total tokens. Building upon these properties, we propose a dynamic Batch Size Scheduler. Extensive experiments demonstrate that our revised formula precisely captures the dynamics of large-scale pre-training, and the resulting scheduling strategy significantly enhances both training efficiency and final model quality.

## Follow-Up Questions

1. What is the Critical Batch Size concept originally proposed by OpenAI, and why does it fail to apply when using a Warmup-Stable-Decay (WSD) learning rate scheduler instead of a cosine or constant schedule?

2. The paper defines B_min (minimum batch size to reach a target loss) and B_opt (batch size that maximizes data efficiency). Why do these two quantities differ, and in what practical scenarios would you prioritize one over the other?

3. The E(S) relationship characterizes the trade-off between data consumption E and training steps S. How does increasing batch size affect this trade-off, and what does it mean geometrically to "move along" the E(S) curve?

4. How does the WSD scheduler's three-phase structure (warmup, stable, decay) interact with batch size dynamics differently than a standard cosine decay schedule? Why does the decay phase specifically complicate the original Critical Batch Size theory?

5. The proposed dynamic Batch Size Scheduler changes batch size during training. What are the practical engineering challenges of changing batch size mid-training in distributed systems, and how might this interact with gradient accumulation and memory constraints?

6. The paper claims improvements in both training efficiency and final model quality. Are these improvements inherently linked, or could a schedule exist that improves efficiency at the cost of quality — and how would you detect that trade-off?

7. How does this work relate to the broader question of compute-optimal training (Chinchilla scaling laws), and does having an optimal batch size schedule change the recommended token-to-parameter ratio for a given compute budget?
