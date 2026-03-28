[The Synthetic Data Playbook: Generating Trillions of the Finest Tokens](https://huggingface.co/spaces/HuggingFaceFW/finephrase?fbclid=IwY2xjawQbER9leHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe_2Eb286GLTZ7n4b4J2-etrO4PgflmLTbKcugbO3D9C0oaiZdBJWgtPUEKEc_aem_It7-alVRbQCrzhYH3nX2Ug)

Joel Niklaus, Guilherme Penedo, Hynek Kydlicek, Elie Bakouch, Lewis Tunstall, Ed Beeching, Thibaud Frere, Colin Raffel, Leandro von Werra, Thomas Wolf

> We ran 90 experiments, generated over 1 trillion tokens, and spent 12.7 GPU years to find the best recipe for synthetic pretraining data. The result is FinePhrase, a 486B token dataset that clearly outperforms all existing synthetic data baselines. It’s available on the Hub, and this post walks you through everything we learned along the way.

90개 이상의 실험, 1T 규모 + 10만 + GPU를 활용하여 좋은 인사이트 주고 있어서, 합성의 기본기를 닦기에 좋은 문서
## Follow-Up Questions

1. The playbook ran 90 experiments with over 1 trillion tokens of synthetic data. What experimental variables did they sweep — data generation method, quality filtering thresholds, mixture ratios, or generator model choice — and how did they control for confounds across this large experimental space?

2. FinePhrase (486B tokens) outperforms all prior synthetic data baselines. What specific characteristics of FinePhrase — generation method, filtering criteria, or diversity — account for its superiority, and how sensitive is its quality to the particular choices made in those 90 experiments?

3. Synthetic pretraining data risks introducing systematic biases or artifacts from the generator model into the student model. What methods does the playbook use to detect and mitigate such model-induced artifacts, and how do they test whether FinePhrase avoids the "model collapse" failure mode?

4. The playbook claims to have found the "best recipe" for synthetic pretraining data based on 90 experiments. What evidence do they provide that their recipe generalizes across different model architectures, scales, and downstream tasks rather than being optimized for a specific narrow setting?

5. The experiments cost 12.7 GPU years. What makes synthetic data research so computationally expensive — is it the generation cost, the training cost for evaluation, or the need to train many small ablation models — and how could future work reduce this cost while still yielding reliable conclusions?

6. FinePhrase uses "rephrasing" as its core technique. How does rephrasing-based synthetic data compare to purely generative synthetic data (e.g., textbook-style generation) in terms of information novelty — does rephrasing preserve the information content of the original web text, or does it filter and compress it?

7. The playbook covers pretraining data. How do the synthetic data insights transfer to post-training (SFT and RLHF) data generation — are the optimal generation strategies and quality thresholds fundamentally different for instruction-following data versus pretraining corpora?
