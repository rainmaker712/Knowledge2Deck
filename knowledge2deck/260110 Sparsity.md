[Sparsity: The License to Skip](https://ttsugriy.github.io/perf-bits/sparsity.html)

Authors: Taras Tsugrii

- Not all computation is equally valuable. Skip the parts that don’t matter.
- With 90% sparsity, you skip 90% of the multiplications. 10x speedup, right? -> No, GPU Problem
- How? N:M Sparsity, Block Sparsity
- MoE: $y = \sum_{i=1}^{N} G(x)_i \cdot E_i(x)$ - G: Gate, E: Experts
- Lottery Ticket View: Training is search
- Sparsity says: you don’t have to compute everything. Structure says: here’s how to actually skip it. MoE says: let the input decide what matters.

## Follow-Up Questions

1. Why doesn’t 90% sparsity translate directly to a 10x speedup on GPUs, and what specific properties of GPU architecture create this gap between theoretical and realized speedup?

2. What distinguishes N:M sparsity from block sparsity in terms of hardware compatibility and the granularity of the skip pattern? When would you choose one over the other?

3. In the MoE formulation $y = \sum_{i=1}^{N} G(x)_i \cdot E_i(x)$, the gate $G(x)$ decides which experts are active. What are the training challenges of learning a good gate function, and what happens if the gate collapses to always selecting the same experts?

4. The "Lottery Ticket" framing describes training as a search process for a sparse subnetwork. How does this view change our understanding of what pretraining is actually achieving, and why might the winning subnetwork only emerge after training rather than being discoverable upfront?

5. Unstructured sparsity (individual weight zeroing) achieves the best model quality at a given sparsity level but is hardware-unfriendly. What techniques or future hardware developments might eventually make unstructured sparsity practically useful?

6. MoE routes computation based on input content, while N:M and block sparsity are static structural choices. How do these two approaches to "skipping computation" differ in their expressivity, and could they be combined effectively?

7. At what point in the model lifecycle (pretraining, finetuning, or inference) is sparsity most impactful, and are there quality/efficiency trade-offs that look different depending on which stage you apply it?

