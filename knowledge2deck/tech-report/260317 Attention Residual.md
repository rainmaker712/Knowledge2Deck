[Attention Residual](https://github.com/MoonshotAI/Attention-Residuals/blob/master/Attention_Residuals.pdf)

Authors: Kimi Team

> Residual connections [12] with PreNorm [60] are standard in modern LLMs, yet they accumulate all layer outputs with fixed unit weights. This uniform aggregation causes uncontrolled hidden-state growth with depth, progressively diluting each layer’s contribution [27]. We propose Attention Residuals (AttnRes), which replaces this fixed accumulation with softmax attention over preceding layer outputs, allowing each layer to selectively aggregate earlier representations with learned, input-dependent weights. To address the memory and communication overhead of attending over all preceding layer outputs for large-scale model training, we introduce Block AttnRes, which partitions layers into blocks and attends over block-level representations, reducing the memory footprint while preserving most of the gains of full AttnRes. Combined with cache-based pipeline communication and a two-phase computation strategy, Block AttnRes becomes a practical drop-in replacement for standard residual connections with minimal overhead. Scaling law experiments confirm that the improvement is consistent across model sizes, and ablations validate the benefit of content-dependent depth-wise selection. We further integrate AttnRes into the Kimi Linear architecture [69] (48B total / 3B activated parameters) and pre-train on 1.4T tokens, where AttnRes mitigates PreNorm dilution, yielding more uniform output magnitudes and gradient distribution across depth, and improves downstream performance across all evaluated tasks.
## Follow-Up Questions

1. Standard residual connections accumulate all layer outputs with fixed unit weights, causing "uncontrolled hidden-state growth with depth." Why does this growth dilute each layer's contribution — is this a problem of scale, direction, or both — and why does it become progressively worse with more layers?

2. AttnRes replaces fixed residual accumulation with softmax attention over preceding layer outputs, giving each layer "input-dependent weights" over earlier representations. What computational analogy does this draw with inter-token attention, and why is the depth-wise selection benefit expected to be independent of the token-level attention already in the model?

3. Full AttnRes requires attending over all preceding layer outputs, which is memory-intensive. Block AttnRes groups layers and attends over block-level representations instead. What information is lost by this blocking, and how do you choose the optimal block size to balance memory cost against quality retention?

4. AttnRes is motivated by "PreNorm dilution" — the observation that PreNorm+residual connections cause magnitudes to become non-uniform with depth. Why does this magnitude non-uniformity affect model quality, and does AttnRes fix the root cause or only the symptom?

5. The paper validates AttnRes through scaling law experiments, claiming "consistent improvement across model sizes." What is the scaling exponent change introduced by AttnRes — does it shift the loss-compute tradeoff curve, or primarily improve the intercept at all scales?

6. AttnRes is integrated into the Kimi Linear architecture (48B total / 3B active parameters). How does the combination of MoE sparse activation and depth-wise attention residuals interact — could the selective expert activation create additional training instability or routing collapse when combined with AttnRes?

7. What are the failure modes or edge cases for AttnRes — for instance, are there training scenarios (very deep networks, specific learning rate schedules, or data types) where attending over preceding layers could cause instability, gradient issues, or degenerate attention patterns?
