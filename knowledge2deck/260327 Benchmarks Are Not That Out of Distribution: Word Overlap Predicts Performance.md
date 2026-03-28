[Benchmarks Are Not That Out of Distribution: Word Overlap Predicts Performance](https://arxiv.org/abs/2602.10657)

Woojin Chung, Jeonghoon Kim

> Understanding what constitutes high-quality pre-training data remains a central question in language model training. In this work, we investigate whether benchmark performance is primarily driven by the degree of statistical pattern overlap between pre-training corpora and evaluation datasets. We measure this overlap using word-level unigram cross-entropy and word frequency statistics, and perform controlled experiments across 10 zero-shot benchmarks, 4 pre-training datasets spanning 8.5B to 60B tokens, and model sizes ranging from 400M to 3B parameters. Our results demonstrate a robust inverse relationship between word-level unigram cross-entropy and benchmark performance, suggesting that widely used benchmarks are strongly influenced by word overlap between training and evaluation data. Thus, larger pre-training subsets with similar word-level unigram cross-entropy yield improved downstream results, indicating that word frequency statistics play an additional role in shaping benchmark scores. Taken together, these results suggest that many standard benchmarks are only weakly out-of-distribution relative to pre-training corpora, so that simple word-overlap statistics predict benchmark performance.

## Follow-Up Questions

1. The paper finds a "robust inverse relationship between word-level unigram cross-entropy and benchmark performance." Why would word-level unigram overlap — a surface-level statistical measure — predict benchmark performance so reliably, and what does this imply about what these benchmarks are actually testing?

2. The study controls for model size (400M to 3B) and pre-training dataset (8.5B to 60B tokens). How do the effects of word overlap interact with scale — does larger training data or a larger model reduce the predictive power of unigram cross-entropy, or does the relationship remain equally strong at all scales tested?

3. If standard benchmarks are "only weakly out-of-distribution relative to pre-training corpora," what are the practical implications for the way the field uses benchmarks to measure generalization? Are there specific benchmark categories (factual, reasoning, multi-step) that are more or less susceptible to this word-overlap confound?

4. The paper uses "word frequency statistics" as a separate predictor of benchmark scores. How does word frequency interact with unigram cross-entropy — are they measuring the same underlying phenomenon (data overlap), or do they capture complementary aspects of the training-evaluation relationship?

5. The finding suggests that "larger pre-training subsets with similar word-level unigram cross-entropy yield improved downstream results." Does this imply that benchmark improvements from scaling data are partly explained by increased overlap rather than better generalization, and how would you separate these two effects?

6. The experiments are conducted on 10 zero-shot benchmarks. Would the word-overlap prediction relationship hold for few-shot settings, instruction-following benchmarks, or open-ended generation tasks — and why might the relationship change across these evaluation paradigms?

7. If this result is correct at scale (for frontier models trained on trillions of tokens), it would suggest that widely used benchmarks like MMLU or ARC-Challenge may not be reliable measures of genuine generalization. What would be required to design benchmarks that are truly out-of-distribution relative to all current pretraining corpora?
