[260112 Extending the Context of Pretrained LLMs by Dropping their Positional Embeddings](https://www.arxiv.org/abs/2512.12167)

Authors: Yoav Gelberg, Koshi Eguchi, Takuya Akiba, Edoardo Cetin

> So far, expensive finetuning beyond the pretraining sequence length has been a requirement for effectively extending the context of language models (LM). In this work, we break this key bottleneck by Dropping the Positional Embeddings of LMs after training (DroPE). Our simple method is motivated by three key theoretical and empirical observations. First, positional embeddings (PEs) serve a crucial role during pretraining, providing an important inductive bias that significantly facilitates convergence. Second, over-reliance on this explicit positional information is also precisely what prevents test-time generalization to sequences of unseen length, even when using popular PE-scaling methods. Third, positional embeddings are not an inherent requirement of effective language modeling and can be safely removed after pretraining, following a short recalibration phase. Empirically, DroPE yields seamless zero-shot context extension without any long-context finetuning, quickly adapting pretrained LMs without compromising their capabilities in the original training context. Our findings hold across different models and dataset sizes, far outperforming previous specialized architectures and established rotary positional embedding scaling methods.

***
Sakana가 오랫만에 다시 등장했군요
일반 학습 이후에 PE를 제거하고 원래 Length를 Cont. Learning으로 진행 후 Zero-Shot Extention.

