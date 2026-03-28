[Reverse Thinking Makes LLMs Stronger Reasoners](https://arxiv.org/pdf/2411.19865)

Authors: Justin Chih-Yao Chen, Zifeng Wang, Hamid Palangi, Rujun Han, Sayna Ebrahimi, Long Le, Vincent Perot, Swaroop Mishra, Mohit Bansal, Chen-Yu Lee, Tomas Pfister

> Reverse thinking plays a crucial role in human reasoning. Humans can reason not only from a problem to a solution but also in reverse, i.e., start from the solution and reason towards the problem. This often enhances overall reasoning performance as it enables consistency checks between their forward and backward thinking. To enable Large Language Models (LLMs) to perform reverse thinking, we introduce Reverse-Enhanced Thinking (RevThink), a framework composed of data augmentation and learning objectives. In RevThink, we augment the dataset by collecting structured forward-backward reasoning from a teacher model, consisting of: (1) the original question, (2) forward reasoning, (3) backward question, and (4) backward reasoning. We then employ three objectives to train a smaller student model in a multi-task learning fashion: (a) generate forward reasoning from a question, (b) generate a backward question from a question, and (c) generate backward reasoning from the backward question. Experiments across 12 datasets covering commonsense, math, and logical reasoning show an average 13.53% improvement over the student model's zero-shot performance and a 6.84% improvement over the strongest knowledge distillation baselines. Moreover, our method demonstrates sample efficiency -- using only 10% of the correct forward reasoning from the training data, it outperforms a standard fine-tuning method trained on 10x more forward reasoning. RevThink also exhibits strong generalization to out-of-distribution held-out datasets.


***

- If we’ve got high-quality Q&A datasets, let’s definitely use those as our baseline.
- I suggest using STEM along with Korean high-quality data.
- We need a solid filtering logic in place.
- Should we focus on putting together the Benchmark training set first?
- It's showing massive performance in Math and Code, just like TPT.
- Plus, since this is all about Reasoning, we’ll probably need to do both Pre-training + Reasoning SFT to see a real difference.

## Follow-Up Questions

1. Why does reverse thinking improve reasoning performance in humans, and what does this suggest about the limitations of forward-only chain-of-thought prompting in LLMs?

2. RevThink trains the student model on three objectives simultaneously: generating forward reasoning, generating a backward question, and generating backward reasoning. How might conflicting gradients across these objectives affect training stability, and what does multi-task learning contribute beyond simply fine-tuning on combined data?

3. The method achieves strong performance using only 10% of correct forward reasoning examples, outperforming a standard fine-tuning model trained on 10x more data. What mechanisms could explain this sample efficiency — is it the backward signal itself, or the structure of the training objectives?

4. How is the "backward question" constructed from an original question and its answer, and what makes a good backward question for testing consistency between forward and backward reasoning chains?

5. RevThink relies on a teacher model to generate structured forward-backward reasoning pairs. What are the risks of this approach if the teacher model makes systematic errors in its backward reasoning, and how might such errors propagate to the student?

6. The paper evaluates across commonsense, math, and logical reasoning datasets. Are there reasoning domains where backward thinking would be less applicable or potentially harmful — for instance, where the reverse problem is ill-defined?

7. Given the results showing improvements on out-of-distribution datasets, what does RevThink’s generalization suggest about whether backward reasoning teaches domain-specific skills or a more general reasoning capability?