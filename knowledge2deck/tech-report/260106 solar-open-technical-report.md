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

    
    