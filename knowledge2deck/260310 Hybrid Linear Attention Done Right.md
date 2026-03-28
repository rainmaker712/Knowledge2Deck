[Hybrid Linear Attention Done Right: Efficient Distillation and Effective Architectures for Extremely Long Contexts](https://arxiv.org/abs/2601.22156)

Yingfa Chen, Zhen Leng Thai, Zihan Zhou, Zhu Zhang, Xingyu Shen, Shuo Wang, Chaojun Xiao, Xu Han, Zhiyuan Liu

> Hybrid Transformer architectures, which combine softmax attention blocks and recurrent neural networks (RNNs), have shown a desirable performance-throughput tradeoff for long-context modeling, but their adoption and studies are hindered by the prohibitive cost of large-scale pre-training from scratch. Some recent studies have shown that pre-trained softmax attention blocks can be converted into RNN blocks through parameter transfer and knowledge distillation. However, these transfer methods require substantial amounts of training data (more than 10B tokens), and the resulting hybrid models also exhibit poor long-context performance, which is the scenario where hybrid models enjoy significant inference speedups over Transformer-based models. In this paper, we present HALO (Hybrid Attention via Layer Optimization), a pipeline for distilling Transformer models into RNN-attention hybrid models. We then present HypeNet, a hybrid architecture with superior length generalization enabled by a novel position encoding scheme (named HyPE) and various architectural modifications. We convert the Qwen3 series into HypeNet using HALO, achieving performance comparable to the original Transformer models while enjoying superior long-context performance and efficiency. The conversion requires just 2.3B tokens, less than 0.01% of their pre-training data.

## Follow-Up Questions

1. HALO converts a pre-trained Transformer into a hybrid RNN-attention model using only 2.3B tokens — less than 0.01% of original pretraining data. Why is such efficient conversion possible, and what knowledge in the attention weights is being preserved versus discarded during the transfer to recurrent layers?

2. The paper identifies "poor long-context performance" as a key weakness of prior hybrid model conversion methods. Why would converting attention layers to RNNs specifically hurt long-context performance, and what does HypeNet's novel position encoding (HyPE) do differently to address this?

3. The paper frames the adoption of hybrid models as "hindered by the prohibitive cost of large-scale pre-training from scratch." Is distillation from a pre-trained Transformer a complete solution to this problem, or are there capabilities that only emerge from pre-training natively as a hybrid model from the start?

4. HypeNet applies "various architectural modifications" beyond just position encoding. What types of modifications are typically necessary when converting Transformer blocks to recurrent blocks, and how do these interact with the behavior of the remaining softmax attention layers?

5. The HALO pipeline converts the Qwen3 series specifically. How model-specific is the distillation process — could HALO be applied to models with different architectures (e.g., different normalization schemes, attention variants, or token embedding approaches) without significant redesign?

6. Hybrid models enjoy "significant inference speedups over Transformer-based models" particularly for long contexts. At what context length does the crossover point occur where a hybrid model becomes faster than an equivalent Transformer, and how does this crossover scale with model size?

7. What are the key failure cases where a Transformer distilled into a hybrid model would be expected to underperform the original — for instance, are there task types where the recurrent state is fundamentally insufficient regardless of how well the distillation is done?
