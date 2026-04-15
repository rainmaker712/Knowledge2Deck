[Reverse Thinking Makes LLMs Stronger Reasoners](https://arxiv.org/abs/2411.19865)

Authors: Justin Chih-Yao Chen, Zifeng Wang, Hamid Palangi, Rujun Han, Sayna Ebrahimi, Long Le, Vincent Perot, Swaroop Mishra, Mohit Bansal, Chen-Yu Lee, Tomas Pfister

> RevThink augments training data with backward reasoning (solution → problem) alongside forward reasoning, training student models on three objectives simultaneously, achieving 13.53% average improvement over zero-shot and 6.84% over knowledge distillation baselines across 12 reasoning datasets.

- **Bidirectional reasoning via data augmentation**: A teacher model (Gemini-1.5-Pro) generates four components per sample — original question, forward reasoning chain, backward question, and backward reasoning — with consistency verification between directions.
- **Three-task multi-task learning**: Student models train simultaneously on forward reasoning generation, backward question generation, and backward reasoning generation, but only use forward reasoning at test time (no inference overhead).
- **Remarkable parameter efficiency**: Mistral-7B + RevThink outperforms Mistral-8x22B zero-shot by 8.36% despite having 25× fewer parameters.
- **Sample efficiency**: With only 10% of training data, RevThink surpasses standard fine-tuning on the full dataset — backward reasoning acts as a strong regularizer.
- **Generalizes out-of-distribution**: 2.11–5.35% improvements on held-out benchmarks (BoolQ, OpenbookQA, e-SNLI, GSM8K-Reversal) not seen during training.

## Follow-Up Questions

1. Why does training on backward reasoning improve forward reasoning at test time, even though backward reasoning is never used at inference?
2. How does RevThink's backward question generation differ from simply augmenting with more forward reasoning examples, and why does directionality matter?
3. What makes the consistency verification step between forward and backward reasoning critical — what happens without it?
4. How does RevThink compare to chain-of-thought prompting and self-consistency decoding, and are these approaches complementary?
5. Why does RevThink show stronger gains on math and logic tasks compared to commonsense reasoning tasks?
6. What are the failure modes of RevThink — what types of problems does backward reasoning not help with or potentially hurt?
7. How does the quality of the teacher model's backward reasoning affect student model performance, and could weaker teachers degrade results?

## Answers

**1.** Backward reasoning forces the model to deeply internalize the structural relationship between problem and solution. By learning to reconstruct a problem from its solution, the model must understand *why* each reasoning step is valid, not just *what* steps to take. This bidirectional understanding creates a richer internal representation of reasoning patterns that transfers to forward-only inference — similar to how students who can teach material forward and backward understand it more deeply than those who only solve problems in one direction.

**2.** Standard data augmentation adds more examples of the same type (forward Q→A), which can lead to overfitting to surface patterns. Backward reasoning introduces a fundamentally different perspective: given answer A, generate the question Q that would produce it. This forces the model to understand the solution space structure, not just the problem space. The directionality matters because it trains the model to verify consistency — a forward answer must be derivable from the backward question, creating an internal "sanity check" mechanism.

**3.** Without consistency verification, the teacher model may generate backward questions that are logically inconsistent with the original — e.g., a backward question whose "correct" answer would be different from the original. Training on inconsistent pairs would teach the model that the same solution can arise from contradictory premises, directly undermining reasoning quality. The verification step ensures backward reasoning is not just creative generation but logically grounded reconstruction.

**4.** Chain-of-thought (CoT) prompting improves reasoning at inference time by eliciting step-by-step thinking. Self-consistency uses multiple reasoning paths and majority voting. RevThink operates at training time, teaching the model to internalize reasoning structure rather than eliciting it through prompting. These are complementary: RevThink-trained models could further benefit from CoT prompting or self-consistency at inference. The key distinction is that RevThink has zero inference overhead — all benefits come from improved model weights.

**5.** Math and logic tasks have well-defined inverse operations — if `x + 3 = 7`, the backward question naturally leads to `x = 4` and back. The backward reasoning path is unambiguous and verifiable. Commonsense reasoning tasks often have multiple valid backward questions (many causes can lead to the same effect), making the backward signal noisier. The consistency verification filter may also be stricter for math/logic, yielding cleaner training signal for those domains.

**6.** RevThink struggles with problems that are inherently asymmetric — where the inverse problem is ill-posed or has many valid answers (one-to-many mappings). Creative tasks, open-ended generation, and highly context-dependent commonsense problems may not benefit as much. There's also a risk that errors in the teacher's backward reasoning propagate to the student, particularly for edge cases where the teacher model itself is uncertain. Tasks requiring world knowledge rather than structural reasoning may see smaller gains.

**7.** Teacher quality significantly affects results because the student learns both *what* backward questions look like and *how* to reason through them. A weaker teacher generating incorrect or poorly structured backward reasoning would introduce noise that the consistency filter may not fully catch. The paper uses Gemini-1.5-Pro specifically because its strong reasoning capabilities produce high-quality, consistent backward reasoning chains. Using a smaller or weaker teacher (e.g., GPT-3.5) would likely reduce gains and could potentially hurt performance if backward reasoning quality falls below a threshold needed for the consistency verification to function as intended.
