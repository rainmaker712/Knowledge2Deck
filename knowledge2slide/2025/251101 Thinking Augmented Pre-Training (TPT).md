[THINKING AUGMENTED PRE-TRAINING (TPT)](https://arxiv.org/abs/2509.20186)

Authors: Liang Wang, Nan Yang, Shaohan Huang, Li Dong, Furu Wei (Microsoft Research)

> This paper introduces a simple and scalable approach to improve the data efficiency of large language model (LLM) training by augmenting existing text data with thinking trajectories. The compute for pre-training LLMs has been growing at an unprecedented rate, while the availability of high-quality data remains limited. Consequently, maximizing the utility of available data constitutes a significant research challenge. A primary impediment is that certain high-quality tokens are difficult to learn given a fixed model capacity, as the underlying rationale for a single token can be exceptionally complex and deep. To address this issue, we propose Thinking augmented Pre-Training (TPT), a universal methodology that augments text with automatically generated thinking trajectories. Such augmentation effectively increases the volume of the training data and makes high-quality tokens more learnable through step-by-step reasoning and decomposition. We apply TPT across diverse training configurations up to 100B tokens, encompassing pre-training with both constrained and abundant data, as well as mid-training from strong open-source checkpoints. Experimental results indicate that our method substantially improves the performance of LLMs across various model sizes and families. Notably, TPT enhances the data efficiency of LLM pre-training by a factor of 3. For a 3B parameter model, it improves the post-training performance by over 10% on several challenging reasoning benchmarks.

- Efficient Prompting: Compressing prompts via the Feynman Technique is a highly effective strategy for optimizing token usage. I especially love their use of the Feynman technique and how they managed to compress the prompt into just two lines.

```markdown
Simulate an expert's in-depth thought process as they analyze the above context, focusing on complex and informative aspects.
Skip trivial details. Use Feynman technique whenever possible to ensure a deep understanding.
```

- Scalability: The approach is universally applicable as it eliminates the need for human annotation and is agnostic to document structure.

- Versatility: Its ability to be applied not only to STEM but also to general text is a remarkable achievement.

