[Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)

Authors: Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, Rewon Child, Scott Gray, Alec Radford, Jeffrey Wu, Dario Amodei

> We study empirical scaling laws for language model performance on the cross-entropy loss. The loss scales as a power-law with model size, dataset size, and the amount of compute used for training, with some trends spanning more than seven orders of magnitude. Other architectural details such as network width or depth have minimal effects within a wide range. Simple equations govern the dependence of overfitting on model/dataset size and the dependence of training speed on model size. These relationships allow us to determine the optimal allocation of a fixed compute budget. Larger models are significantly more sample-efficient, such that optimally compute-efficient training involves training very large models on a relatively modest amount of data and stopping significantly before convergence.

## Follow-Up Questions

1. The paper finds that loss scales as a power-law with model size, dataset size, and compute. Why is the power-law relationship significant rather than, say, a linear or logarithmic one, and what does it imply about the diminishing returns of scaling each factor?

2. The authors conclude that larger models are more sample-efficient and that optimal training stops significantly before convergence. Why does early stopping before convergence make sense from a compute-efficiency perspective, and under what practical deployment conditions might you still want to train to convergence?

3. The paper reports that architectural details like network width or depth have minimal effects over a wide range. What does this suggest about where practitioners should focus their search during model design, and are there any scenarios where architecture choices would still matter significantly?

4. The scaling laws span more than seven orders of magnitude. What assumptions or conditions must hold for empirical power-law relationships to remain valid across such an extreme range, and what could cause them to break down at very large or very small scales?

5. How does this paper's finding that "optimal compute-efficient training involves training very large models on a relatively modest amount of data" conflict with or complement the later Chinchilla paper's recommendation, and what additional variable did Chinchilla identify that this work underweighted?

6. The paper derives equations governing overfitting as a function of model and dataset size ratio. How would you use these equations in practice to decide whether to acquire more data versus increasing model size, given a fixed inference budget rather than a fixed training compute budget?

7. What are the key limitations of using cross-entropy loss as the primary metric for studying scaling laws, particularly when the goal is to understand downstream task performance, reasoning ability, or capabilities that may emerge discontinuously?
