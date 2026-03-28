[Nanbeige4-3B Technical Report: Exploring the Frontier of Small Language Models](https://arxiv.org/abs/2512.06266)

Chen Yang, Guangyue Peng, Jiaying Zhu, Ran Le, Ruixiang Feng, Tao Zhang, Wei Ruan, Xiaoqi Liu, Xiaoxue Cheng, Xiyun Xu, Yang Song, Yanzipeng Gao, Yiming Jia, Yun Xing, Yuntao Wen, Zekai Wang, Zhenwei An, Zhicong Sun, Zongchao Chen

> We present Nanbeige4-3B, a family of small-scale but high-performing language models. Pretrained on 23T high-quality tokens and finetuned on over 30 million diverse instructions, we extend the boundary of the scaling law for small language models. In pre-training, we design a Fine-Grained Warmup-Stable-Decay (FG-WSD) training scheduler, which progressively refines data mixtures across stages to boost model performance. In post-training, to improve the quality of the SFT data, we design a joint mechanism that integrates deliberative generation refinement and chain-of-thought reconstruction, yielding substantial gains on complex tasks. Following SFT, we employ our flagship reasoning model to distill Nanbeige4-3B through our proposed Dual Preference Distillation (DPD) method, which leads to further performance gains. Finally, a multi-stage reinforcement learning phase was applied, leveraging verifiable rewards and preference modeling to strengthen abilities on both reasoning and human alignment. Extensive evaluations show that Nanbeige4-3B not only significantly outperforms models of comparable parameter scale but also rivals much larger models across a wide range of benchmarks. The model checkpoints are available at this https URL.

## Follow-Up Questions

1. Nanbeige4-3B is pretrained on 23T tokens, which is significantly more than standard compute-optimal token counts for a 3B model according to Chinchilla scaling laws. What does training a small model on far more tokens than "optimal" achieve, and does this represent a deliberate departure from compute-optimal training toward inference-optimal training?

2. The Fine-Grained Warmup-Stable-Decay (FG-WSD) scheduler "progressively refines data mixtures across stages." How does this differ from a fixed data mixture throughout training, and what specific properties of the data mixture are being refined — quality thresholds, domain ratios, or sequence length distributions?

3. The "Dual Preference Distillation" (DPD) method distills from a flagship reasoning model. What makes this approach "dual" — does it use both positive and negative preference pairs, distill from two teacher models, or optimize two separate objectives? How does DPD differ from standard DPO or RLHF?

4. The post-training pipeline combines deliberative generation refinement with chain-of-thought reconstruction for SFT data quality. What specific artifacts or errors in naive SFT data does each of these techniques address, and could they conflict with each other?

5. The model uses "verifiable rewards" in its RL phase alongside preference modeling. What types of tasks provide verifiable rewards at the 3B scale, and how does the balance between verifiable (objective) and preference-based (subjective) reward signals affect the model's final behavior?

6. Nanbeige4-3B "rivals much larger models across a wide range of benchmarks." What caveats should be applied to this claim — for instance, are there benchmark categories where the gap with larger models remains significant, and are there systematic patterns in where small models trained on massive data still fall short?

7. What are the practical trade-offs of training a 3B model on 23T tokens versus training a larger model (e.g., 7B or 13B) on proportionally fewer tokens to the same total compute budget, in terms of inference speed, memory footprint, and task performance?

