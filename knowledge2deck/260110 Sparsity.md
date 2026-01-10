[Sparsity: The License to Skip](https://ttsugriy.github.io/perf-bits/sparsity.html)

Authors: Taras Tsugrii

- Not all computation is equally valuable. Skip the parts that don’t matter.
- With 90% sparsity, you skip 90% of the multiplications. 10x speedup, right? -> No, GPU Problem
- How? N:M Sparsity, Block Sparsity
- MoE: $y = \sum_{i=1}^{N} G(x)_i \cdot E_i(x)$ - G: Gate, E: Experts
- Lottery Ticket View: Training is search
- Sparsity says: you don’t have to compute everything. Structure says: here’s how to actually skip it. MoE says: let the input decide what matters.

