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
