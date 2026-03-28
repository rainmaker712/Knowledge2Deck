[Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer](https://arxiv.org/abs/2203.03466)

Authors: Greg Yang, Edward J. Hu, Igor Babuschkin, Szymon Sidor, Xiaodong Liu, David Farhi, Nick Ryder, Jakub Pachocki, Weizhu Chen, Jianfeng Gao

> Hyperparameter (HP) tuning in deep learning is an expensive process, prohibitively so for neural networks (NNs) with billions of parameters. We show that, in the recently discovered Maximal Update Parametrization (muP), many optimal HPs remain stable even as model size changes. This leads to a new HP tuning paradigm we call muTransfer: parametrize the target model in muP, tune the HP indirectly on a smaller model, and zero-shot transfer them to the full-sized model, i.e., without directly tuning the latter at all. We verify muTransfer on Transformer and ResNet. For example, 1) by transferring pretraining HPs from a model of 13M parameters, we outperform published numbers of BERT-large (350M parameters), with a total tuning cost equivalent to pretraining BERT-large once; 2) by transferring from 40M parameters, we outperform published numbers of the 6.7B GPT-3 model, with tuning cost only 7% of total pretraining cost. A Pytorch implementation of our technique can be found at this http URL and installable via `pip install mup`.

## Follow-Up Questions

1. muTransfer claims zero-shot HP transfer from small to large models via muP. What is the theoretical guarantee behind this claim, and under what conditions (e.g., architectural changes, optimizer type, data distribution) does the transfer break down?

2. The paper demonstrates HP transfer for learning rate. Which hyperparameters are theoretically justified to transfer under muP, and which are empirically transferred without a formal guarantee? What distinguishes these two categories?

3. muP modifies the initialization and learning rate scaling of specific weight matrices differently (e.g., input/output embeddings vs. hidden weights). Why do input and output layers require different treatment from hidden layers, and what pathology arises if they are all treated uniformly?

4. The GPT-3 6.7B experiment shows that transferring from a 40M parameter proxy reduces tuning cost to 7% of pretraining. What assumptions about training dynamics must hold for this cost reduction to be valid, and how do differences in dataset size between proxy and target affect the transfer?

5. The paper verifies muTransfer on Transformers and ResNets. Are there architectural motifs (e.g., normalization layers, attention with different key/query dimensions, sparse architectures like MoE) where muP may not apply cleanly, and why?

6. muP was developed under the infinite-width limit of neural networks. How does the finite-width nature of practical models create deviations from the theory, and at what model sizes do these finite-width corrections become non-negligible?

7. Beyond learning rate, what does muTransfer imply about the broader problem of neural scaling laws — does stable HP transfer across scales challenge or support the view that larger models are qualitatively different from smaller ones?
