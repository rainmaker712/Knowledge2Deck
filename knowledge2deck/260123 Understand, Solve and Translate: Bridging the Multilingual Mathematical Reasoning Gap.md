[Multi-Step Reasoning in Korean and the Emergent Mirage](https://arxiv.org/abs/2501.05712)

Guijin Son, Hyunwoo Ko, Dasol Choi

> We introduce HRMCR (HAE-RAE Multi-Step Commonsense Reasoning), a benchmark designed to evaluate large language models' ability to perform multi-step reasoning in culturally specific contexts, focusing on Korean. The questions are automatically generated via templates and algorithms, requiring LLMs to integrate Korean cultural knowledge into sequential reasoning steps. Consistent with prior observations on emergent abilities, our experiments reveal that models trained on fewer than \(2 \cdot 10^{25}\) training FLOPs struggle to solve any questions, showing near-zero performance. Beyond this threshold, performance improves sharply. State-of-the-art models (e.g., O1) still score under 50\%, underscoring the difficulty of our tasks. Notably, stepwise analysis suggests the observed emergent behavior may stem from compounding errors across multiple steps rather than reflecting a genuinely new capability. We publicly release the benchmark and commit to regularly updating the dataset to prevent contamination.

## Follow-Up Questions

1. The HRMCR benchmark focuses on multi-step commonsense reasoning in culturally specific Korean contexts. Why is cultural specificity an important axis for evaluating multi-step reasoning — as opposed to just testing general mathematical or logical reasoning in Korean — and what types of errors does cultural specificity expose that language-agnostic tests miss?

2. The paper observes emergent ability: models trained on fewer than 2·10^25 FLOPs show near-zero performance, with sharp improvement beyond this threshold. How does this emergent behavior on culturally grounded Korean reasoning compare to emergence observed in English-centric benchmarks — does cultural grounding shift the emergence threshold?

3. The "stepwise analysis suggests the observed emergent behavior may stem from compounding errors across multiple steps rather than reflecting a genuinely new capability." What is the significance of this distinction — does it matter whether emergence is genuine capability acquisition versus error accumulation reduction, and how would you design experiments to tell them apart?

4. State-of-the-art models like O1 still score under 50% on HRMCR. What specific aspects of Korean cultural reasoning remain hard even for the most capable models, and are these failures likely to be resolved by more data and scale, or do they require architectural or training innovations?

5. The benchmark uses automatically generated questions via templates and algorithms. What are the risks of template-based generation for cultural reasoning tasks — specifically, could templates accidentally create questions with unintended shortcuts or fail to capture the breadth of authentic Korean cultural reasoning?

6. The authors commit to "regularly updating the dataset to prevent contamination." What is the contamination risk for a Korean-language culturally specific benchmark, and how does the contamination dynamics differ from English benchmarks that appear in large web crawls?

7. Given that the benchmark reveals large gaps even in frontier models, what training strategies would most plausibly close the cultural reasoning gap — additional Korean-language pretraining data, culturally grounded instruction tuning, or something else?
