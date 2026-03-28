[Task-Adaptive Pretrained Language Models via Clustered-Importance Sampling](https://arxiv.org/abs/2410.03735)

David Grangier, Simin Fan, Skyler Seto, Pierre Ablin

> Specialist language models (LMs) focus on a specific task or domain on which they often outperform generalist LMs of the same size. However, the specialist data needed to pretrain these models is only available in limited amount for most tasks. In this work, we build specialist models from large generalist training sets instead. We propose a novel method, ClusteRed Importance SamPling (CRISP). CRISP clusters the generalist dataset and samples from these clusters based on their frequencies in the smaller specialist dataset. It is scalable, suitable for both pretraining and continued pretraining, and works well in multi-task settings. CRISP performs favorably compared to other methods that adjust the training distribution of the generalist data with guidance from the limited domain-specific data. Our findings demonstrate improvements across different domains in terms of language modeling perplexity and accuracy on multiple-choice question tasks. We also present ablation studies that examine the impact of dataset sizes, clustering configurations, and model sizes.

## Follow-Up Questions

1. CRISP clusters the generalist dataset and samples from clusters based on their frequency in the specialist dataset. Why is cluster-frequency-based sampling more effective than directly upsampling the specialist data or using importance weights at the individual document level?

2. The method is described as "scalable" and suitable for "both pretraining and continued pretraining." What makes importance sampling approaches for domain adaptation computationally challenging at scale, and how does the clustering step in CRISP specifically address the scalability bottleneck?

3. CRISP works in "multi-task settings" where the model must adapt to multiple specialist domains simultaneously. How does the cluster sampling strategy handle potentially conflicting domain signals — for instance, if a cluster is highly relevant for domain A but harmful for domain B?

4. The paper compares CRISP to "other methods that adjust the training distribution of the generalist data with guidance from limited domain-specific data." What are the alternative approaches, and what theoretical or empirical property makes cluster-based importance sampling superior to them?

5. CRISP uses "word-level" clustering of the generalist dataset. At what level of granularity (token, sentence, document, or cluster) should the importance weights be computed, and how does the choice of granularity affect the quality of domain adaptation versus computational cost?

6. The specialist dataset is described as "limited in amount for most tasks." How sensitive is CRISP's effectiveness to the size of the specialist dataset used to estimate cluster frequencies — at what data volumes does the frequency estimation become unreliable, and what happens to model quality when it does?

7. What are the key limitations of the CRISP approach — specifically, are there target domains or task types where the generalist dataset doesn't contain sufficient content in any cluster to effectively adapt the model, and how would you identify and handle such cases?
