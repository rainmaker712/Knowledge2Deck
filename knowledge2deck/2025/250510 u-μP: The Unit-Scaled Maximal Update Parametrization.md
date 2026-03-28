[u-μP: The Unit-Scaled Maximal Update Parametrization](https://arxiv.org/abs/2407.17465)

Authors: Charlie Blake, Constantin Eichenberg, Josef Dean, Lukas Balles, Luke Y. Prince, Björn Deiseroth, Andres Felipe Cruz-Salinas, Carlo Luschi, Samuel Weinbach, Douglas Orr

> The Maximal Update Parametrization (μP) aims to make the optimal hyperparameters (HPs) of a model independent of its size, allowing them to be swept using a cheap proxy model rather than the full-size target model. We present a new scheme, u-μP, which improves upon μP by combining it with Unit Scaling, a method for designing models that makes them easy to train in low-precision. The two techniques have a natural affinity: μP ensures that the scale of activations is independent of model size, and Unit Scaling ensures that activations, weights and gradients begin training with a scale of one. This synthesis opens the door to a simpler scheme, whose default values are near-optimal. This in turn facilitates a more efficient sweeping strategy, with u-μP models reaching a loss that is equal to or lower than comparable μP models and working out-of-the-box in FP8.

## Follow-Up Questions

1. μP ensures that optimal hyperparameters remain stable across model sizes, while Unit Scaling ensures activations, weights, and gradients start at scale one. Why does combining these two properties lead to "near-optimal default values" — what problem does each solve independently that the other cannot?

2. u-μP enables FP8 training "out-of-the-box." What specific numerical stability challenges does FP8 introduce that standard parametrizations (like NTK or standard PyTorch defaults) fail to handle, and how does unit scaling at initialization address them?

3. The hyperparameter transfer paradigm sweeps HPs on a small proxy model and transfers zero-shot to the full-size model. What types of hyperparameters transfer well under u-μP, and are there HP dimensions (e.g., dropout rates, weight decay schedules) that are unlikely to transfer even with correct parametrization?

4. μP changes the learning rate scaling from the standard 1/width to 1/width² for certain layers. Why does this specific scaling rule arise from the theory, and what happens to training dynamics if you apply the wrong scaling exponent?

5. Unit Scaling initializes all components to scale one at the start of training. How does this interact with learning rate warmup schedules — is warmup still necessary under u-μP, and does the rationale for warmup change when initial scales are well-controlled?

6. The paper claims u-μP models reach "equal or lower loss" compared to comparable μP models. What confounds might exist in this comparison — for instance, does the benefit come from better HP transfer, better low-precision training, or a genuinely better optimization trajectory?

7. What are the practical limitations of the proxy-model sweep paradigm — specifically, in what architectural families or training regimes might the optimal HPs found at small scale fail to transfer accurately even under u-μP?
