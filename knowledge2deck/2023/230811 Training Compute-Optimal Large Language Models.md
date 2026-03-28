[Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)

Authors: Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Elena Buchatskaya, Trevor Cai, Eliza Rutherford, Diego de Las Casas, Lisa Anne Hendricks, Johannes Welbl, Aidan Clark, Tom Hennigan, Eric Noland, Katie Millican, George van den Driessche, Bogdan Damoc, Aurelia Guy, Simon Osindero, Karen Simonyan, Erich Elsen, Jack W. Rae, Oriol Vinyals, Laurent Sifre

> We investigate the optimal model size and number of tokens for training a transformer language model under a given compute budget. We find that current large language models are significantly undertrained, a consequence of the recent focus on scaling language models whilst keeping the amount of training data constant. By training over 400 language models ranging from 70 million to over 16 billion parameters on 5 to 500 billion tokens, we find that for compute-optimal training, the model size and the number of training tokens should be scaled equally: for every doubling of model size the number of training tokens should also be doubled. We test this hypothesis by training a predicted compute-optimal model, Chinchilla, that uses the same compute budget as Gopher but with 70B parameters and 4× more more data. Chinchilla uniformly and significantly outperforms Gopher (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on a large range of downstream evaluation tasks. This also means that Chinchilla uses substantially less compute for fine-tuning and inference, greatly facilitating downstream usage. As a highlight, Chinchilla reaches a state-of-the-art average accuracy of 67.5% on the MMLU benchmark, greater than a 7% improvement over Gopher.

## Follow-Up Questions

1. The paper concludes that model size and training tokens should be scaled equally - what empirical evidence or theoretical reasoning supports this 1:1 scaling relationship, and under what assumptions might this ratio differ?

2. Why were models like GPT-3 and Gopher considered "significantly undertrained" prior to this work? What implicit assumption about scaling had been guiding the field that this paper challenges?

3. Chinchilla uses the same compute budget as Gopher but achieves better performance at 70B parameters versus 280B. What does this imply about the practical economics of model deployment beyond just training cost?

4. How were the over 400 models trained in this study used to derive the compute-optimal scaling law? What methodology connects the individual model experiments to the general scaling relationship?

5. The "Chinchilla scaling laws" assume a fixed compute budget. How should the optimal model size and token count change if the objective is instead to minimize inference cost at a given quality level, rather than minimizing training cost?

6. What are the key limitations of this work's approach to defining "compute-optimal" - for instance, does it account for data quality, curriculum, or the diminishing returns of training on repeated data when token budgets are large?

7. Since the publication of this paper, models like LLaMA have been deliberately over-trained beyond the Chinchilla-optimal point. Under what practical circumstances is it rational to train a smaller model on far more tokens than the Chinchilla ratio suggests?