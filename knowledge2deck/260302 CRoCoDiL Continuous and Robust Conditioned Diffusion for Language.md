[CRoCoDiL: Continuous and Robust Conditioned Diffusion for Language](https://arxiv.org/abs/2603.20210)

Authors: Roy Uziel, Omer Belhasin, Itay Levi, Akhiad Bercovich, Ran El-Yaniv, Ran Zilberstein, Michael Elad

> Masked Diffusion Models (MDMs) struggle to capture token interdependencies because they rely on factorized marginal distributions rather than joint distributions. CRoCoDiL shifts the diffusion process into a continuous sentence-level semantic space by jointly training an encoder-demasker architecture, grounding MDM demasking in continuous latent representations. Two hybrid text synthesis algorithms are introduced: ConThenDisc (generate latents via continuous diffusion, then decode to tokens in a single MDM pass) and ConWithinDisc (refine latent guidance mid-generation using partially-masked text embeddings). Applied to LLaDA, CRoCoDiL achieves superior generation quality with more than 10× faster sampling speeds in unconditional generation.

## Key Contributions

- Formally characterizes the **independence gap** in MDMs: models estimate per-token marginals, missing cross-token dependencies that cause semantic incoherence (e.g., "cat barks" and "cat meows" treated equally)
- Introduces a jointly-trained encoder-demasker that conditions token prediction on a continuous latent **z₀ ∈ ℝᵈ**, providing holistic semantic guidance
- Proposes two generation strategies: **ConThenDisc** (latent-first) and **ConWithinDisc** (interleaved latent refinement during discrete sampling)
- Provides a theoretical proof (Theorem B.1) that conditional independence of tokens given **z₀** allows factorized parallel sampling without losing structural information
- Demonstrates 10–14× speedup over base LLaDA on 512–1024 token generation with improved or comparable MAUVE/perplexity scores

## Method / Architecture

**Guided Demasker:** A multi-register encoder **h_ϕ** with K learned suffix tokens compresses a sequence into bottleneck latents. The demasker **f_θ** receives both the partially masked sequence and the continuous embedding as conditioning. Nested dropout enforces progressive information organization in registers.

**Robustness Training:** Gaussian noise augmentation perturbs latents during training (targeting ~0.8 cosine similarity), preventing brittle over-reliance on exact latent values.

**Positional Encoding:** Two-axis rotary embeddings (MRoPE variant) distinguish text tokens from register prefix tokens.

**Generation Algorithms:**
- *ConThenDisc*: Continuous diffusion generates z₀ → single MDM decode pass to tokens
- *ConWithinDisc*: Partial tokens at each MDM step condition a continuous diffusion update, iteratively refining latent guidance throughout discrete sampling

**MDM-based Autoencoder:** Encodes sequences to continuous latents, reconstructs via iterative guided MDM refinement — validates reconstruction fidelity separately from generation quality.

## Results

- **512-token generation:** ConWithinDisc matches base LLaDA quality using ×13 fewer demasker calls (NFE 40 vs 512)
- **1024-token generation:** ×14 speedup with improved MAUVE and lower perplexity
- **Reconstruction:** CodeBERTScore F1 of 0.96–0.97 on 256-token sequences; CER 0.12–0.42 depending on NFE budget
- **Latent interpolation:** Smooth interpolation between unrelated code programs maintains coherent outputs, indicating well-structured latent geometry
- Experiments on code synthesis using LLaDA-8B, Qwen embeddings, StarCoder Python dataset (12M sequences)

## Takeaways

- The independence gap in MDMs is a fundamental structural limitation—not just a capacity issue—and continuous latent conditioning is a principled solution
- Factorizable sampling is theoretically justified when conditioning on **z₀**, enabling parallel decoding without sacrificing joint distribution modeling
- The 10×+ speedup comes from amortizing long-range structure into the latent, letting the discrete MDM focus on local token decisions
- Architecture is modular: the guided demasker can be plugged into any MDM backbone (demonstrated with LLaDA)
- Current work covers unconditional generation only; conditional (prompt-based) generation is left as future work

## Follow-Up Questions

1. The independence gap is proven to exist in standard MDMs, but is it fundamentally unresolvable without continuous latents — or could larger MDMs with attention patterns spanning full sequences implicitly learn joint distributions?
2. ConWithinDisc interleaves continuous diffusion steps with discrete sampling. How is the number of continuous diffusion updates per discrete step chosen, and how sensitive is quality to this hyperparameter?
3. Nested dropout enforces progressive information organization in registers. What specific information does each register capture — does register 1 hold coarse semantics and later registers fine-grained details?
4. The paper focuses on unconditional generation, but how would CRoCoDiL handle conditional generation (e.g., instruction following, question answering)? Would the encoder condition on the prompt, the target, or both?
5. Register-space interpolation between unrelated programs stays coherent. Does this imply the latent space is semantically smooth everywhere, or only along interpolation paths between training examples?
6. The speedup comes from reducing NFE (Neural Function Evaluations). How does CRoCoDiL compare to other MDM acceleration methods like MDLM or Plaid that reduce NFE via different mechanisms?
7. The theoretical proof assumes conditional independence of tokens given z₀. In practice, how well does the trained model satisfy this assumption, and is there a way to measure the residual dependence?

## Answers

**1.** The paper argues the independence gap is structural: MDMs are trained to minimize token-wise cross-entropy at each masking level, so the objective never explicitly encourages joint coherence. Larger models could in principle attend across all positions, but the factorized training signal remains the bottleneck—the model is never rewarded for joint consistency. Continuous latents sidestep this by providing a holistic summary that the demasker can condition on, making joint structure implicit rather than requiring the discrete model to infer it from scratch.

**2.** The paper does not specify a fixed schedule for continuous diffusion updates per discrete step in ConWithinDisc. Instead, the method conditions continuous diffusion on the partially unmasked text at each MDM iteration, effectively running a short conditional diffusion chain. The NFE budget (total evaluations) is the main control parameter; the paper shows results at NFE 20–80, with quality improving predictably. Sensitivity to this hyperparameter is demonstrated empirically rather than analytically optimized.

**3.** The nested dropout mechanism (applied during training) progressively disables later registers, forcing early registers to capture the most critical information for reconstruction. This creates a hierarchy where the first register holds the most compressed, globally necessary semantic content, while later registers capture increasingly fine-grained details. The paper validates this through ablations on K (number of registers: 8, 64, 128), showing that more registers improve reconstruction quality at higher NFE budgets.

**4.** For conditional generation, the most natural extension would be to condition the encoder on both prompt and target during training (masked conditional MDM), then at inference time use prompt-conditioned latents to guide the target's demasking. However, the paper explicitly defers this to future work. The modular encoder-demasker design makes this extension architecturally feasible without redesigning the core framework.

**5.** The smooth interpolation experiment is suggestive but not a proof of global smoothness. Interpolation between training examples likely traverses regions well-covered by training data, where the encoder has learned meaningful representations. Regions far from training examples (extrapolation) may be poorly structured. The noise augmentation during training helps robustify the boundary regions, but true global smoothness is not claimed.

**6.** MDLM and similar methods reduce NFE by training models that can skip timesteps (e.g., via learned time-step schedules or distillation). CRoCoDiL's speedup is mechanistically different: it reduces NFE because the continuous latent pre-computes long-range structure, allowing each discrete step to be more decisive. These are complementary; CRoCoDiL could in principle be combined with MDM acceleration techniques. A direct controlled comparison is absent from the paper, which is a limitation the authors acknowledge.

**7.** The theorem proves factorization holds *if* the encoder perfectly captures all cross-token dependencies in z₀. In practice, this is approximate—the encoder has finite capacity and may not capture rare dependencies. Residual dependence could be measured via conditional mutual information between tokens given z₀ on held-out data. The robustness noise augmentation and reconstruction quality metrics (CER, CodeBERTScore) provide indirect evidence that z₀ captures most structure, but formal independence tests are not performed.
