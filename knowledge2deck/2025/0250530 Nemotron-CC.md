[Nemotron-CC: Transforming Common Crawl into a Refined Long-Horizon Pretraining Dataset](https://arxiv.org/abs/2412.02595)

Authors: Dan Su, Kezhi Kong, Ying Lin, Joseph Jennings, Brandon Norick, Markus Kliegl, Mostofa Patwary, Mohammad Shoeybi, Bryan Catanzaro

> Recent English Common Crawl datasets like FineWeb-Edu and DCLM achieved significant benchmark gains via aggressive model-based filtering, but at the cost of removing 90% of data. This limits their suitability for long token horizon training, such as 15T tokens for Llama 3.1. In this paper, we show how to achieve better trade-offs between accuracy and data quantity by a combination of classifier ensembling, synthetic data rephrasing, and reduced reliance on heuristic filters. When training 8B parameter models for 1T tokens, using a high-quality subset of our data improves MMLU by 5.6 over DCLM, demonstrating the efficacy of our methods for boosting accuracies over a relatively short token horizon. Furthermore, our full 6.3T token dataset matches DCLM on MMLU, but contains four times more unique real tokens than DCLM. This unlocks state-of-the-art training over a long token horizon: an 8B parameter model trained for 15T tokens, of which 7.2T came from our dataset, is better than the Llama 3.1 8B model: +5 on MMLU, +3.1 on ARC-Challenge, and +0.5 on average across ten diverse tasks. The dataset is available at this https URL.

- FineWeb-Edu나 DCLM 같은 기존 데이터셋은 공격적인 필터링으로 데이터의 90%를 제거하여 장기 학습(예: 15T 토큰)에 한계가 있었습니다.
- 이 논문은 분류기 앙상블, 합성 데이터 재구성, 휴리스틱 필터 축소를 통해 정확도와 데이터 양의 균형을 맞춘 Nemotron-CC 데이터셋을 제안합니다.
- 성능: 1T 토큰 학습 시 DCLM 대비 MMLU 5.6점 향상.
- 규모: 전체 6.3T 토큰 데이터셋은 DCLM과 동급의 성능을 내면서도 4배 더 많은 고유 토큰을 보유.
- 결과: 15T 토큰 학습 시 Llama 3.1 8B 모델보다 우수한 성능(MMLU +5점)을 달성.

## Follow-Up Questions

1. FineWeb-Edu and DCLM remove 90% of Common Crawl data through aggressive model-based filtering. What are the trade-offs between high data quality (via aggressive filtering) and data diversity (via retaining more data), and at what training token horizon does this trade-off become critical?

2. Nemotron-CC combines classifier ensembling with synthetic data rephrasing. Why is an ensemble of classifiers more effective than a single high-quality classifier for data filtering, and what types of data quality signals does each classifier in the ensemble likely capture?

3. The paper shows that the high-quality subset achieves +5.6 MMLU over DCLM at 1T tokens, while the full 6.3T dataset only matches DCLM at the same token count. What does this imply about the relationship between data quality, data quantity, and training efficiency at different compute budgets?

4. Having 4x more unique real tokens than DCLM is positioned as a key advantage for long-horizon training. What specific risks arise when training on repeated or semantically similar tokens beyond a certain threshold, and how does data diversity relate to the scaling laws for compute-optimal training?

5. Synthetic data rephrasing is used as part of the pipeline rather than pure filtering. How does rephrasing change the distribution of the original web data, and what risks does this introduce in terms of model collapse or distribution shift compared to natural text?

6. The final model outperforms Llama 3.1 8B across multiple benchmarks despite being trained on partially overlapping data. How should we interpret benchmark improvements when the evaluation sets themselves may overlap with Common Crawl-derived training data?

7. The paper reduces reliance on "heuristic filters." What are the limitations of heuristic-based data filtering compared to model-based approaches, and are there categories of content where heuristic filters outperform model-based classifiers even at scale?