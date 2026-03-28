[Nemotron-Cascade 2: Post-Training LLMs with Cascade RL and Multi-Domain On-Policy Distillation](https://arxiv.org/abs/2603.19220)

Zhuolin Yang, Zihan Liu, Yang Chen, Wenliang Dai, Boxin Wang, Sheng-Chieh Lin, Chankyu Lee, Yangyi Chen, Dongfu Jiang, Jiafan He, Renjie Pi, Grace Lam, Nayeon Lee, Alexander Bukharin, Mohammad Shoeybi, Bryan Catanzaro, Wei Ping

> We introduce Nemotron-Cascade 2, an open 30B MoE model with 3B activated parameters that delivers best-in-class reasoning and strong agentic capabilities. Despite its compact size, its mathematical and coding reasoning performance approaches that of frontier open models. It is the second open-weight LLM, after DeepSeekV3.2-Speciale-671B-A37B, to achieve Gold Medal-level performance in the 2025 International Mathematical Olympiad (IMO), the International Olympiad in Informatics (IOI), and the ICPC World Finals, demonstrating remarkably high intelligence density with 20x fewer parameters. In contrast to Nemotron-Cascade 1, the key technical advancements are as follows. After SFT on a meticulously curated dataset, we substantially expand Cascade RL to cover a much broader spectrum of reasoning and agentic domains. Furthermore, we introduce multi-domain on-policy distillation from the strongest intermediate teacher models for each domain throughout the Cascade RL process, allowing us to efficiently recover benchmark regressions and sustain strong performance gains along the way. We release the collection of model checkpoint and training data.

## Follow-Up Questions

1. Nemotron-Cascade 2 uses "Cascade RL" as its post-training approach. What does "cascade" mean in this context — does it refer to a staged RL process where simpler tasks are mastered before harder ones, a hierarchy of reward models, or something else — and why would a cascade structure outperform standard RL applied uniformly?

2. The model achieves Gold Medal-level performance on IMO, IOI, and ICPC despite having 20x fewer parameters than DeepSeekV3.2-Speciale-671B. What does "intelligence density" mean quantitatively, and is the performance gap mainly due to the training methodology (Cascade RL + distillation) or architectural efficiency (3B active out of 30B total)?

3. "Multi-domain on-policy distillation from the strongest intermediate teacher models for each domain" is used to recover benchmark regressions during RL training. What causes benchmark regressions during RL — is it overfitting to the RL reward signal, distributional shift from on-policy sampling, or something else — and why does on-policy distillation specifically address this?

4. The model covers "a much broader spectrum of reasoning and agentic domains" than Nemotron-Cascade 1. What are the particular challenges of RL training that spans both reasoning domains (math, code) and agentic domains (tool use, multi-step planning) simultaneously — do these domains require fundamentally different reward structures?

5. The training uses "a meticulously curated dataset" for SFT before applying Cascade RL. How critical is the SFT initialization for subsequent RL performance — would a weaker SFT initialization lead to worse final performance despite equal RL compute, or does RL eventually overcome a poor starting point?

6. The model is 30B total / 3B active (MoE). For competition math problems like IMO, which require sustained multi-step reasoning over many tokens, how does the MoE routing interact with the need for consistent, coherent reasoning — could routing instability or expert inconsistency across steps hurt performance on these tasks?

7. What are the key limitations of Cascade RL as a post-training approach — are there capability gaps that remain even after applying it, or task distributions where the cascade structure fails to provide meaningful improvement over standard RL?
