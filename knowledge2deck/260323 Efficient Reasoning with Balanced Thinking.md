[Efficient Reasoning with Balanced Thinking](https://arxiv.org/abs/2603.12372)

Yulin Li, Tengyao Tu, Li Ding, Junjie Wang, Huiling Zhen, Yixin Chen, Yong Li, Zhuotao Tian

> Large Reasoning Models (LRMs) have shown remarkable reasoning capabilities, yet they often suffer from overthinking, expending redundant computational steps on simple problems, or underthinking, failing to explore sufficient reasoning paths despite inherent capabilities. These issues lead to inefficiencies and potential inaccuracies, limiting practical deployment in resource-constrained settings. Existing methods to mitigate overthinking, such as suppressing reflective keywords or adjusting reasoning length, may inadvertently induce underthinking, compromising accuracy. Therefore, we propose ReBalance, a training-free framework that achieves efficient reasoning with balanced thinking. ReBalance leverages confidence as a continuous indicator of reasoning dynamics, identifying overthinking through high confidence variance and underthinking via consistent overconfidence. By aggregating hidden states from a small-scale dataset into reasoning mode prototypes, we compute a steering vector to guide LRMs' reasoning trajectories. A dynamic control function modulates this vector's strength and direction based on real-time confidence, pruning redundancy during overthinking, and promoting exploration during underthinking. Extensive experiments conducted on four models ranging from 0.5B to 32B, and across nine benchmarks in math reasoning, general question answering, and coding tasks demonstrate that ReBalance effectively reduces output redundancy while improving accuracy, offering a general, training-free, and plug-and-play strategy for efficient and robust LRM deployment.

## Follow-Up Questions

1. ReBalance uses confidence variance as the signal for overthinking and consistent overconfidence as the signal for underthinking. How is "confidence" operationally defined in this context — is it token-level probability, entropy over the vocabulary, or something else? How sensitive is the framework to the choice of confidence metric?

2. The reasoning mode prototypes are aggregated from hidden states on a small-scale dataset. How is this dataset selected, and how much does the choice of calibration data affect the quality of the steering vectors? Is there a risk of prototype drift when the steering vectors are applied to inputs far from the calibration distribution?

3. The paper claims ReBalance is training-free and plug-and-play. What are the computational overheads introduced by the dynamic control function and steering vector computation at inference time, and are these overheads acceptable in latency-sensitive deployment settings?

4. Existing approaches to reduce overthinking (suppressing reflective keywords, adjusting reasoning length) are said to induce underthinking. What does this asymmetry reveal about the underlying mechanism of overthinking — is it a superficial stylistic behavior or a deeper feature of how LRMs allocate reasoning budget?

5. The dynamic control function modulates the steering vector's strength and direction in real-time. What are the failure modes of this approach — for example, could the framework misclassify a genuinely complex problem as an overthinking case and prematurely terminate useful reasoning chains?

6. ReBalance is evaluated on models from 0.5B to 32B parameters. How do the characteristics of overthinking and underthinking change across this scale range? Are larger models more prone to one failure mode than the other, and does the optimal steering vector strength differ by model scale?

7. The paper addresses both overthinking and underthinking as dual failure modes. Could the same confidence-based framework be extended to detect a third failure mode — incorrect early commitment (high confidence but wrong), which is distinct from both over- and underthinking? What changes would be needed to the steering mechanism to address this?
