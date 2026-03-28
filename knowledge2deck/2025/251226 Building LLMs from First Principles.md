[Building LLMs from First Principles](https://ttsugriy.github.io/llm-first-principles/)

Authors: Taras Tsugrii

## Follow-Up Questions

1. What are the fundamental architectural decisions that must be made when building an LLM from scratch — such as tokenization strategy, attention mechanism, and positional encoding — and how do these choices interact with each other?

2. When building from "first principles," how do you decide which established practices (e.g., pre-LayerNorm vs. post-LayerNorm, RoPE vs. learned embeddings) to adopt versus which to derive independently through experimentation?

3. What does it mean to truly understand a component of an LLM "from first principles" as opposed to treating it as a black box? How would you test whether your understanding is deep enough to make principled modifications?

4. How do the engineering constraints of distributed training (data parallelism, tensor parallelism, pipeline parallelism) force architectural decisions that might differ from what you'd design if running on a single device?

5. What role does the choice of loss function and optimizer play in defining what an LLM "learns," and are there alternatives to cross-entropy + AdamW that could lead to fundamentally different model behaviors?

6. When building an LLM from first principles, how do you handle the feedback loop between data quality, model architecture, and evaluation — given that you can't fully evaluate capabilities until the model is trained?

7. What are the most common misconceptions practitioners have about how LLMs work internally, and which of these could only be resolved by building one from scratch rather than fine-tuning an existing model?