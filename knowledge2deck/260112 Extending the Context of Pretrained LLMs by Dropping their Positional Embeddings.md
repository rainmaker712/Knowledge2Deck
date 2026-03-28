[260112 Extending the Context of Pretrained LLMs by Dropping their Positional Embeddings](https://www.arxiv.org/abs/2512.12167)

Authors: Yoav Gelberg, Koshi Eguchi, Takuya Akiba, Edoardo Cetin

> So far, expensive finetuning beyond the pretraining sequence length has been a requirement for effectively extending the context of language models (LM). In this work, we break this key bottleneck by Dropping the Positional Embeddings of LMs after training (DroPE). Our simple method is motivated by three key theoretical and empirical observations. First, positional embeddings (PEs) serve a crucial role during pretraining, providing an important inductive bias that significantly facilitates convergence. Second, over-reliance on this explicit positional information is also precisely what prevents test-time generalization to sequences of unseen length, even when using popular PE-scaling methods. Third, positional embeddings are not an inherent requirement of effective language modeling and can be safely removed after pretraining, following a short recalibration phase. Empirically, DroPE yields seamless zero-shot context extension without any long-context finetuning, quickly adapting pretrained LMs without compromising their capabilities in the original training context. Our findings hold across different models and dataset sizes, far outperforming previous specialized architectures and established rotary positional embedding scaling methods.

***
Sakana가 오랫만에 다시 등장했군요
일반 학습 이후에 PE를 제거하고 원래 Length를 Cont. Learning으로 진행 후 Zero-Shot Extention.

## Follow-Up Questions

1. The paper argues that positional embeddings (PEs) are critical during pretraining as an inductive bias for convergence, but become a liability at inference time. Why does this dual role create the specific generalization bottleneck that DroPE addresses?

2. What does the "short recalibration phase" after dropping PEs involve, and why is it needed? What does the model need to relearn or adjust during this phase?

3. How does the over-reliance on explicit positional information specifically prevent length generalization in popular PE-scaling methods like RoPE scaling or ALiBi? What breaks when the model encounters sequence lengths beyond the training distribution?

4. The method achieves zero-shot context extension without long-context finetuning. What are the remaining failure modes or edge cases where DroPE might still underperform compared to models specifically finetuned for long context?

5. The paper claims PEs can be "safely removed after pretraining" - what mechanism allows the model to maintain position sensitivity without explicit positional embeddings, and does this imply attention patterns alone carry sufficient positional information?

6. How does DroPE compare to training from scratch on NoPE (No Positional Embedding) architectures, and what does this comparison reveal about when in the training process positional information becomes most critical?

7. Given that DroPE relies on a recalibration phase after dropping PEs, what factors determine how long this phase needs to be, and is there a risk that recalibration degrades performance on the original training context length?
