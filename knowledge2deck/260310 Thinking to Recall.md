[Thinking to Recall: How Reasoning Unlocks Parametric Knowledge in LLMs](https://arxiv.org/abs/2603.09906)

Zorik Gekhman, Roee Aharoni, Eran Ofek, Mor Geva, Roi Reichart, Jonathan Herzig

> This paper investigates why reasoning improves factual knowledge retrieval in LLMs — even for simple, single-hop questions where no complex inference is required. Two mechanisms are identified: a computational buffer effect (reasoning tokens provide extra compute that aids retrieval regardless of semantic content) and factual priming (reasoning activates related facts that serve as retrieval bridges). The study also reveals that intermediate hallucinations during reasoning propagate to final answers, but selecting hallucination-free reasoning paths restores accuracy.

- **Two Mechanisms — Distinct and Important**: (1) **Computational Buffer** — reasoning tokens give the model extra compute steps before producing the answer, improving retrieval even when the intermediate content is semantically irrelevant. Compute alone helps. (2) **Factual Priming** — reasoning surfaces related facts that act as associative bridges to the target knowledge. Both effects compound, which is why reasoning improves recall beyond what chain-of-thought skeptics expect.

- **Hallucination Propagation is a Real Problem**: Incorrect intermediate reasoning steps don't stay isolated — they compound into downstream errors in the final answer. This is a concrete mechanism for why reasoning models can confidently produce wrong answers: the error is baked in mid-chain.

- **Hallucination-Free Path Selection Recovers Accuracy**: Filtering or selecting reasoning paths that avoid intermediate hallucinations substantially improves final answer accuracy. This motivates process reward models (PRMs) over outcome reward models (ORMs) — catching errors mid-chain is more valuable than grading the final answer alone.

- **Implication for Reasoning Model Design**: Even "unnecessary" reasoning (thinking before answering a trivial question) provides measurable benefit via the buffer effect. This challenges the view that extended thinking should be reserved only for hard problems.

## Follow-Up Questions

1. The paper identifies two distinct mechanisms — computational buffer and factual priming — for how reasoning improves knowledge retrieval. How do these two effects interact, and is it possible to isolate their individual contributions empirically? What experimental design would cleanly separate them?

2. The computational buffer effect suggests that even semantically irrelevant reasoning tokens improve retrieval. Does this imply that any form of token generation before the answer (e.g., filler text, random tokens, or repeated context) would provide similar benefit, or is there something specific about coherent reasoning that amplifies the effect beyond pure compute?

3. Intermediate hallucinations during reasoning are shown to propagate to final answers. What is the mechanistic explanation for this propagation at the level of attention patterns or hidden state evolution? Does the hallucination compound multiplicatively, or does it act as a hard constraint that anchors the final answer?

4. The paper motivates process reward models (PRMs) over outcome reward models (ORMs) based on the hallucination propagation finding. What practical challenges arise in deploying PRMs at scale, and does this paper's evidence suggest that step-level supervision is more important for retrieval tasks than for multi-step mathematical reasoning?

5. If reasoning helps simple single-hop factual questions through the buffer effect, what are the implications for model architectures that use adaptive compute (e.g., speculative decoding or early exit)? Should these systems always allocate a minimum reasoning budget even for "easy" queries?

6. The factual priming mechanism suggests reasoning surfaces associative bridges to target knowledge. How does this relate to the known phenomenon of context-dependent memory in humans, and does the paper find any evidence that the quality or relevance of the intermediate facts mediates the final retrieval accuracy?

7. The findings challenge the view that extended thinking should be reserved only for hard problems. What are the practical and economic trade-offs of applying extended reasoning universally, and how should future work determine the optimal reasoning budget as a function of question difficulty and knowledge sparsity?
