[Solar Open Technical Report](https://huggingface.co/upstage/Solar-Open-100B/blob/main/solar-open-technical-report.pdf)

Authors: Upstage Solar Team

> We introduce Solar Open, a 102B-parameter bilingual Mixture-of-Experts language model for under-served languages. Solar Open demonstrates a systematic methodology for building competitive LLMs by addressing three interconnected challenges. First, to train effectively despite data scarcity for un-derserved languages, we synthesize 4.5T tokens of high-quality, domain-specific, and RL-oriented data. Second, we coordinate this data through a progressive curriculum jointly optimizing composi-tion, quality thresholds, and domain coverage across 20 trillion tokens. Third, to enable reasoning capabilities through scalable RL, we apply our proposed framework SnapPO for eﬀicient optimiza-tion. Across benchmarks in English and Korean, Solar Open achieves competitive performance, demonstrating the effectiveness of this methodology for underserved language AI development.

***
- Pre-training
    - 데이터 스테이지마다 합성 비율로 Control (10% -> 64%)
    - 한국어 능력을 끌어올리고자 마지막에 한국어를 끌어올림
    - 필터링: 기본 필터링, 파인웹 필터링, Topic Filtering (Climb) 스타일
- Mid-training
    - Query에 Reasoning Trajectories를 많이 붙임
    - 영어, 한국어 (50:50) 유지
- SFT Data
    - 5개 모델 사용 (Nemotron CC)한 방식과 유사, LLM As Judge로 판단
    - Think vs Non-think
    - 난이도 배분
    - Agent: 벤치마크 의존보다는 Toollist를 제작하고 API Graph 생성 (실제와 유사)
        - Task-Oriented Sim: Easy / Mid / Hard를 정의하고 진행
        - User-Oriented Sim: 실제 Query X, 유저 X
        - Large Scale Datasets
- 한국향
    - Comparative QA, Calsual QA, Multi-Hop QA, Theme Inference QA
- Safety
    - Over-refuse 거부
- Topic Classifier, Diff. Classifier

    
    
## Follow-Up Questions

1. Solar Open addresses data scarcity for underserved languages by synthesizing 4.5T tokens. What are the risks of relying heavily on synthetic data for a language model targeting a low-resource language, and how would you validate that the synthetic data preserves the linguistic and cultural nuances of Korean rather than biasing the model toward its source language (likely English)?

2. The paper uses a progressive curriculum that jointly optimizes composition, quality thresholds, and domain coverage over 20 trillion tokens. Why is a progressive curriculum preferable to training on a fixed mixed dataset, and how do you determine the right transitions between stages without exhaustive ablations?

3. SnapPO is introduced as a framework for scalable RL. What problem with standard RL algorithms like PPO or DPO does SnapPO specifically address at the scale of a 102B MoE model, and what trade-offs does its "efficient optimization" make compared to standard approaches?

4. The pre-training section notes that synthetic data ratios increase from 10% to 64% across stages, and Korean content is boosted at the end. What are the potential negative effects of this late-stage domain reweighting on the model's English capabilities, and how would you measure and mitigate catastrophic forgetting?

5. The SFT data pipeline uses 5 models for data generation and LLM-as-judge for quality assessment. What are the systemic biases that accumulate when using LLMs to both generate and judge training data, and how might these biases manifest differently for Korean versus English outputs?

6. The agentic SFT approach builds a Toollist and API Graph rather than relying on existing benchmarks. What advantages does this task-simulation approach offer, and what gaps in real-world agent evaluation might it still fail to capture?

7. Given that Solar Open targets "under-served languages" with MoE architecture, what specific architectural or training choices in this work are likely to generalize to other underserved language pairs, and which decisions appear to be Korean-specific?

## Answers

**1.** Heavy reliance on synthetic data for a low-resource language like Korean carries several risks: the synthetic generator (typically an English-dominant LLM) may produce Korean text that is grammatically correct but culturally foreign, reflecting translated English idioms rather than native Korean expression patterns. Validation requires native-speaker evaluation on culturally-grounded tasks (e.g., Korean-specific QA types listed in the paper: Comparative QA, Causal QA, Multi-Hop QA, Theme Inference QA) and distributional comparison between synthetic and authentic Korean corpora using perplexity and lexical diversity metrics. The paper's decision to boost Korean data only at the end of pre-training is a risk factor — if the Korean synthetic data has a different register or vocabulary distribution from authentic Korean text, the model may learn a synthetic Korean dialect that scores well on benchmarks but fails in deployment.

**2.** A progressive curriculum is preferable to a fixed mix because data utility varies across training stages: early stages benefit from broad, diverse data that builds general language competence, while later stages profit from high-quality, domain-specific or reasoning-oriented data that would be "wasted" on a randomly initialized model. The key insight is that a model must first develop basic language understanding before it can benefit from complex reasoning traces. Transitions between stages are typically determined through proxy model experiments (train a small-scale version and monitor validation loss slopes and downstream benchmark plateaus), and the paper's curriculum design is informed by synthetic ratio sweep experiments rather than exhaustive full-scale ablations.

**3.** SnapPO addresses the memory and computational inefficiency of standard PPO at the scale of a 102B MoE model. PPO requires maintaining a reference model (for KL penalty computation) alongside the policy model, effectively doubling memory requirements — prohibitive for a 100B-parameter MoE where even single-model inference is expensive. DPO sidesteps this but requires pre-collected offline preference data and cannot adapt based on live policy feedback. SnapPO appears to offer an online or semi-online preference optimization approach that avoids the full reference model overhead, likely through periodic snapshot updates of the reference policy rather than maintaining a full copy, trading some theoretical KL-regularization exactness for practical scalability.

**4.** Late-stage Korean data boosting risks catastrophic forgetting of English capabilities and general domain knowledge established in earlier stages. When a model is fine-tuned or curriculum-trained heavily on one language domain, the weights that encoded other language patterns may be overwritten, particularly in the embedding and early attention layers which are most sensitive to token distribution shifts. Measurement involves evaluating English benchmarks (e.g., MMLU, HellaSwag) before and after the Korean boost stage; mitigation strategies include mixing a maintenance proportion of English data in the Korean boost stage (the paper notes maintaining 50:50 English:Korean in mid-training, which likely serves this purpose) and using a lower learning rate for the final stage to limit the degree of weight modification.

**5.** LLM-as-judge systems accumulate systematic biases through a self-reinforcement loop: models tend to rate higher the outputs that resemble their own generation style, leading to a positive feedback loop where the training data converges toward the judge model's preferences rather than human preferences. For Korean outputs specifically, these biases are compounded because most judge models have stronger English than Korean capabilities, potentially leading to undervaluation of stylistically native Korean responses in favor of formally correct but culturally bland Korean that reads like translated English. The 5-model ensemble approach described in the paper partially mitigates single-judge bias through diversity, but if all 5 models share similar English-dominant pre-training data, the systemic Korean-language bias may persist.

**6.** Building a Toollist and API Graph for agentic evaluation offers the advantage of testing realistic tool-use patterns that benchmarks miss — real agents must handle API call failures, partial responses, tool chaining decisions, and ambiguous user intents that clean benchmark tasks sanitize away. The task-oriented simulation (Easy/Mid/Hard difficulty levels) and user-oriented simulation components allow testing recovery from errors and multi-turn clarification dialogues. However, gaps remain: the simulated API environment may not capture the latency, rate limiting, and authentication failures of real production APIs; and the tool distribution in the Toollist likely overrepresents common developer-facing APIs while underrepresenting domain-specific Korean services (financial, government, healthcare) that are critical for the target user base.

**7.** Architectural decisions likely to generalize to other underserved language pairs include: the progressive synthetic data curriculum with increasing synthetic ratio as a strategy for data-scarce languages; the mid-training reasoning trajectory injection for capability uplift without full retraining; and the LLM-as-judge multi-model ensemble for SFT data quality filtering. Korean-specific decisions include the particular topic taxonomy used for Korean QA categories (Comparative, Causal, Multi-Hop, Theme Inference QA) which reflects Korean educational and cultural discourse patterns; the specific 50:50 English:Korean balance target which was calibrated for Korean-English bilingual performance; and the safety filtering calibrated for Korean-specific over-refusal patterns that differ from English cultural contexts.
