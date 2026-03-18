[Thinking to Recall: How Reasoning Unlocks Parametric Knowledge in LLMs](https://arxiv.org/abs/2603.09906)

Zorik Gekhman, Roee Aharoni, Eran Ofek, Mor Geva, Roi Reichart, Jonathan Herzig

> This paper investigates why reasoning improves factual knowledge retrieval in LLMs — even for simple, single-hop questions where no complex inference is required. Two mechanisms are identified: a computational buffer effect (reasoning tokens provide extra compute that aids retrieval regardless of semantic content) and factual priming (reasoning activates related facts that serve as retrieval bridges). The study also reveals that intermediate hallucinations during reasoning propagate to final answers, but selecting hallucination-free reasoning paths restores accuracy.

- **Two Mechanisms — Distinct and Important**: (1) **Computational Buffer** — reasoning tokens give the model extra compute steps before producing the answer, improving retrieval even when the intermediate content is semantically irrelevant. Compute alone helps. (2) **Factual Priming** — reasoning surfaces related facts that act as associative bridges to the target knowledge. Both effects compound, which is why reasoning improves recall beyond what chain-of-thought skeptics expect.

- **Hallucination Propagation is a Real Problem**: Incorrect intermediate reasoning steps don't stay isolated — they compound into downstream errors in the final answer. This is a concrete mechanism for why reasoning models can confidently produce wrong answers: the error is baked in mid-chain.

- **Hallucination-Free Path Selection Recovers Accuracy**: Filtering or selecting reasoning paths that avoid intermediate hallucinations substantially improves final answer accuracy. This motivates process reward models (PRMs) over outcome reward models (ORMs) — catching errors mid-chain is more valuable than grading the final answer alone.

- **Implication for Reasoning Model Design**: Even "unnecessary" reasoning (thinking before answering a trivial question) provides measurable benefit via the buffer effect. This challenges the view that extended thinking should be reserved only for hard problems.
