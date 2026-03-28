[Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters](https://arxiv.org/abs/2408.03314)

Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar

> Enabling LLMs to improve their outputs by using more test-time computation is a critical step towards building generally self-improving agents that can operate on open-ended natural language. In this paper, we study the scaling of inference-time computation in LLMs, with a focus on answering the question: if an LLM is allowed to use a fixed but non-trivial amount of inference-time compute, how much can it improve its performance on a challenging prompt? Answering this question has implications not only on the achievable performance of LLMs, but also on the future of LLM pretraining and how one should tradeoff inference-time and pre-training compute. Despite its importance, little research attempted to understand the scaling behaviors of various test-time inference methods. Moreover, current work largely provides negative results for a number of these strategies. In this work, we analyze two primary mechanisms to scale test-time computation: (1) searching against dense, process-based verifier reward models; and (2) updating the model's distribution over a response adaptively, given the prompt at test time. We find that in both cases, the effectiveness of different approaches to scaling test-time compute critically varies depending on the difficulty of the prompt. This observation motivates applying a "compute-optimal" scaling strategy, which acts to most effectively allocate test-time compute adaptively per prompt. Using this compute-optimal strategy, we can improve the efficiency of test-time compute scaling by more than 4x compared to a best-of-N baseline. Additionally, in a FLOPs-matched evaluation, we find that on problems where a smaller base model attains somewhat non-trivial success rates, test-time compute can be used to outperform a 14x larger model.

## Follow-Up Questions

1. The paper finds that test-time compute scaling's effectiveness "critically varies depending on the difficulty of the prompt." What is the underlying reason for this dependency — why do easy problems not benefit from more test-time compute, and at what difficulty level do the different scaling strategies break down?

2. The two scaling mechanisms studied are process-based verifier reward models and adaptive distribution updating. What are the key differences between these approaches in terms of how they use additional compute, and in what task settings would each be preferred over the other?

3. A "compute-optimal" strategy allocates test-time compute adaptively per prompt. How does the system estimate prompt difficulty at inference time to decide how much compute to allocate, and what are the risks if this difficulty estimation is miscalibrated?

4. The paper shows a 4x efficiency improvement over best-of-N baseline using compute-optimal allocation. What does "efficiency" mean precisely here — is it performance per FLOPs, success rate at fixed total compute, or latency for a target accuracy — and how does this translate to practical deployment scenarios?

5. The FLOPs-matched comparison shows a small model with test-time scaling can outperform a 14x larger model. What is the prerequisite "somewhat non-trivial success rate" for this to work, and what does this imply about the types of problems where test-time scaling cannot substitute for model capacity?

6. How does scaling test-time compute interact with the pretraining compute budget decision? If test-time compute can substitute for parameter count, should organizations invest more in inference infrastructure and less in frontier model training — and what factors determine the optimal split?

7. What are the fundamental limits of test-time compute scaling — specifically, are there task categories (e.g., open-ended generation, subjective creativity, tasks requiring new knowledge) where no amount of test-time compute can compensate for model limitations, and how do these boundaries relate to verifier quality?
