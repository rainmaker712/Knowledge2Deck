[Artificial Hivemind: The Open-Ended Homogeneity of Language Models (and Beyond)](https://arxiv.org/abs/2510.22954)

Authors: Liwei Jiang, Yuanjun Chai, Margaret Li, Mickel Liu, Raymond Fok, Nouha Dziri, Yulia Tsvetkov, Maarten Sap, Alon Albalak, Yejin Choi

> Language models exhibit an "Artificial Hivemind" effect—both internally repetitive and strikingly homogeneous across different models—revealed through Infinity-Chat, a 26K-query open-ended benchmark with 31K+ human annotations showing that LM judges and reward models are poorly calibrated to diverse human preferences.

- **Artificial Hivemind Effect**: Different LMs produce surprisingly similar outputs on open-ended prompts, suggesting RLHF and shared training pipelines are collapsing model diversity toward a narrow mode of response
- **Infinity-Chat Dataset**: 26K diverse real-world open-ended queries with a 6-type, 17-subcategory taxonomy—designed to stress-test where diversity matters most (creative, opinion, lifestyle, etc.)
- **Human Annotation at Scale**: 31,250 annotations with 25 annotators per example, explicitly capturing inter-annotator disagreement as a signal of genuine preference diversity rather than noise
- **Calibration Failure of LM Judges**: Reward models and LM-as-judge systems are systematically less accurate on prompts that elicit diverse human opinions, meaning RLHF pipelines may be silently penalizing legitimate diversity
- **Safety & Epistemic Risk**: Homogenization of LM outputs poses risks beyond quality—monoculture in AI responses can narrow public discourse and reduce exposure to heterodox but valid perspectives

## Follow-Up Questions

1. What specific mechanisms in RLHF or instruction tuning cause the Artificial Hivemind effect—is it the reward model, the preference data, or the optimization process itself?
2. How does Infinity-Chat's taxonomy of open-ended prompt types differ from existing benchmarks like AlpacaEval or MT-Bench, and which subcategories show the strongest homogenization?
3. Why do LM judges fail to capture diverse human preferences, and what does this imply for RLHF pipelines that use LM-as-judge for scalable feedback?
4. How do the authors measure "homogeneity" across models—what similarity metrics are used, and are there models that buck the trend?
5. What does inter-annotator disagreement reveal about human preference diversity, and how should future reward modeling treat disagreement differently from noise?
6. What interventions could reduce the Hivemind effect—diverse pre-training data, ensemble decoding, multi-objective RLHF, or something else?
7. What are the downstream societal consequences if LMs converge on a narrow response distribution for opinion-forming tasks like summarizing political events or offering life advice?

## Answers

**1.** The Hivemind effect likely stems from multiple compounding factors: preference datasets disproportionately collected from similar annotator demographics, reward models trained to maximize average preference scores (which collapse to modal human opinions), and KL-penalized RL that keeps models close to a shared SFT base. The paper highlights that LM judges compound this by acting as a second-order filter that penalizes outputs deviating from the modal style, creating a feedback loop. The root cause is probably that "preferred" in RLHF implicitly means "preferred by the median annotator," erasing variance as a design choice rather than a bug.

**2.** Existing benchmarks like MT-Bench focus on instruction-following correctness where ground truth exists or is narrowly defined. Infinity-Chat specifically targets prompts with no single correct answer—creative writing, personal advice, opinion, ethical dilemmas—where diversity is a feature. The 17 subcategories capture distinctions like "hypothetical scenarios," "personal recommendations," and "value-laden judgments" that prior benchmarks lump together or ignore. Homogenization is strongest in opinion and advice subcategories, where LMs converge on hedged, balanced responses rather than committing to distinct perspectives.

**3.** LM judges are trained to mimic human average preferences, so they inherit the same modal bias. On diverse-preference prompts, the "correct" answer varies by annotator, but the judge has one fixed evaluation function. This means RLHF using LM-as-judge will reward outputs that satisfy the judge's modal preference and penalize outputs that are idiosyncratic but valid—systematically pushing models toward the Hivemind. The implication is that scalable oversight via LM judges may be actively harmful for diversity-sensitive tasks and should be replaced with ensemble judges or uncertainty-aware reward models.

**4.** The authors measure homogeneity using pairwise similarity across model outputs (e.g., semantic similarity via embeddings, n-gram overlap, and stylistic features). They also measure internal diversity (how much a single model varies across runs with temperature). The Hivemind effect is observed even at the semantic level—models don't just share surface style but converge on similar content and framings. Smaller models or models trained with less RLHF (e.g., base models) tend to show more diversity, suggesting RLHF is the primary homogenizing force.

**5.** High inter-annotator disagreement on a prompt signals genuine human value pluralism—different people have legitimately different preferences, not random noise. Current reward modeling treats disagreement as a problem to be averaged away, but the paper argues it should be treated as a label distribution to be preserved. Future approaches might train reward models to predict preference distributions rather than point estimates, or use multi-headed reward models that represent distinct annotator clusters. This reframing has implications for alignment: "aligned with humans" should mean "aligned with the diversity of humans," not "aligned with the average human."

**6.** Potential interventions include: (1) diversifying preference data by deliberately oversampling minority annotator perspectives; (2) multi-objective RLHF that explicitly optimizes for both quality and output diversity as separate objectives; (3) ensemble decoding that samples from multiple fine-tuned model variants; (4) training separate "persona-conditioned" models and routing by user context; (5) using disagreement-aware reward models that reward responses satisfying diverse annotator subgroups. The most tractable near-term fix is likely improving the diversity of preference data collection rather than changing the RL algorithm.

**7.** If LMs homogenize on opinion-forming tasks, they become amplifiers of the median view—nudging millions of users toward similar framings of political, ethical, and lifestyle questions. This creates epistemic monoculture risk: reduced exposure to minority viewpoints, false consensus effects, and potential manipulation by whoever controls what the "median" training distribution represents. Unlike search engines that surface diverse sources, a single LM response forecloses alternatives. The risk is especially acute for advice on elections, health decisions, and social norms, where diversity of perspective is a democratic value, not just a quality metric.
