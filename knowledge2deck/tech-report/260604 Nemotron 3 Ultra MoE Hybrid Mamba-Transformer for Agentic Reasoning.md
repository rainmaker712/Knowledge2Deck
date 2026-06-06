[Nemotron 3 Ultra: Open, Efficient Mixture-of-Experts Hybrid Mamba-Transformer Model for Agentic Reasoning](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf)

NVIDIA

> We introduce Nemotron 3 Ultra, a 550 billion total and 55 billion active parameter Mixture-of-Experts Hybrid Mamba-Attention language model. We pre-trained Nemotron 3 Ultra on 20 trillion text tokens, then extended the context length to 1M tokens, and post-trained using Supervised Fine Tuning (SFT), Reinforcement Learning (RL), and Multi-teacher On-Policy Distillation (MOPD). Nemotron 3 Ultra is our most capable model yet, employing multiple key technologies - LatentMoE, Multi Token Prediction (MTP), NVFP4 pre-training, multi-environment RLVR, MOPD, and reasoning budget control. Nemotron 3 Ultra achieves up to ~6x higher inference throughput as compared to state-of-the-art publicly available LLMs while attaining on-par accuracy. The state-of-the-art accuracy, high inference throughput, and 1M token context length make Nemotron 3 Ultra ideal for long-running autonomous agentic tasks. We open-source the base, post-trained, and quantized checkpoints, along with the training data and recipe on HuggingFace.

<!-- Panel Verdict: CONDITIONAL -->
<!-- Metaphor: 오케스트라 -->

## 비유로 풀어보기

### 풀려는 문제 (Problem)

세계 최정상급 오케스트라를 만들려면 두 가지 난제를 동시에 풀어야 한다. 첫째, 연주자(parameter)를 충분히 많이 확보해야 레퍼토리의 폭이 넓어진다. 하지만 550B명의 단원 전원이 매 곡마다 무대에 오르면 공연장(GPU memory)이 감당하지 못하고, 객석에 음악이 전달되는 속도(inference throughput)도 느려진다. 둘째, 빠른 리듬 반복에 능한 연주자와 악보 전체를 조감하며 정교한 화성을 짚어내는 연주자는 근본적으로 다른 재능이다. 기존 오케스트라들은 한 종류의 악기(pure Transformer 또는 pure SSM)로만 편성하거나, 둘을 섞더라도 규모가 작아서 대편성 곡을 소화하지 못했다.

NVIDIA가 Nemotron 3 Ultra로 제시하는 질문은 명확하다. "550B 총원 중 55B명만 곡마다 선발해 무대에 올리면서도, 리듬 섹션(Mamba-2)과 솔리스트(Attention)가 한 무대에서 합주하는 초대형 하이브리드 오케스트라를 실전 배치할 수 있는가?" 이 질문에는 훈련 안정성, 후처리(post-training) 품질, 그리고 추론 효율이라는 세 겹의 난관이 겹쳐 있다.

### 어떻게 푸는가 (Method)

**편성(Architecture).** 108개 악장(layer)으로 구성된 이 오케스트라는 두 종류의 파트를 번갈아 배치한다. 리듬 섹션인 Mamba-2 layer는 시퀀스를 일정한 비용으로 훑으며 템포를 유지하고, 솔리스트인 Attention layer는 악보의 어느 마디든 자유롭게 참조하며 정밀한 화성을 잡는다. 각 악장마다 512명의 연주자(expert) 가운데 top-22명만 무대에 올리는 LatentMoE 시스템이 작동하는데, latent dimension 2048의 압축 공간에서 라우팅을 결정해 선발 비용 자체를 줄인다. 결과적으로 총원 550B 중 실제 연주에 참여하는 active parameter는 55B에 불과하다. hidden dimension은 8192이다.

**리허설(Pre-training).** 전체 20 trillion token 분량의 악보를 NVFP4(E2M1) 압축 악보로 읽으며 연습한다. 처음 15T token은 다양한 장르를 골고루 익히는 diversity phase, 이후 5T token은 고난도 곡에 집중하는 quality phase다. 그러나 리허설 도중 8T token과 16T token 지점에서 두 차례 음이 크게 어긋나는 training divergence가 발생했고, 팀은 마지막 깨끗한 체크포인트로 되돌려 재개하는 방식으로 대응했다. 두 번의 되돌림 끝에 총 리허설은 20T token에서 마감되었다. MaxVio로 측정한 expert routing imbalance는 12T token 부근에서 첫 번째 MoE layer의 median 1.2 대비 최대 약 12까지 치솟았고, 모델 깊이에 따른 residual norm 차이는 4 orders of magnitude에 달했다. 이 불균형이 divergence의 주요 상관 요인으로 지목된다.

**객원 지휘자 합동 연습(Post-training).** 리허설을 마친 오케스트라는 세 단계의 마스터클래스를 거친다. 먼저 SFT로 기본 해석을 다듬고, 이어 async GRPO 기반 RLVR을 batch size 8192, multi-environment 세팅으로 수행해 자체 역량을 끌어올린다. 핵심은 그 다음 단계인 MOPD(Multi-teacher On-Policy Distillation)다. 10명 이상의 객원 지휘자(teacher model)가 각자의 해석을 제시하되, 곧바로 증류하지 않고 warmup SFT — 교사 데이터로 짧은 합동 리허설 — 를 먼저 진행해 학생 모델의 분포를 교사 쪽으로 정렬한다. 이후 on-policy rollout 위에서 negative reverse-KL loss와 PPO clipping을 결합한 증류를 2 iteration 반복한다.

**시보 훈련(MTP Boosting).** 마지막으로, 솔리스트가 2마디 앞을 미리 읽는 시보(sight-reading) 훈련에 해당하는 Multi-Token Prediction head를 장착한다. 기존 모델 본체는 얼리고 head만 temperature-scaled forward-KL로 학습시켜, speculative decoding 시 draft token의 수용률을 높인다.

### 무엇을 얻었나 (Result)

MOPD 합동 연습의 효과는 극적이다. Terminal Bench에서 34.5→54.0으로 172.7% recovery를 달성했고, GDPVal 23.2→46.7 (86.4%), SWE-Bench Verified 63.5→71.7 (88.1%), TauBench Telecom 55.7→92.9 (90.3%), BrowseComp 14.3→44.4 (67.0%)로 agentic·retrieval 벤치마크 전반에서 도약했다. 수학·과학 독주에서도 IOI 2025 570.0점(인간 상위 3명 수준), Putnam 2025 96.7%, USAMO 2026 97.6%를 기록하며 최정상 솔리스트의 면모를 보여준다.

추론 효율에서는 편성의 이점이 선명하게 드러난다. 8K input / 64K output의 decode-heavy 워크로드에서 GLM-5.1-754B-A40B 대비 5.9배, Kimi-K2.6-1T-A32B 대비 4.8배, Qwen-3.5-397B-17B 대비 1.6배의 throughput 우위를 보였다. MTP Boosting은 average acceptance length를 4.387→4.584로 끌어올려, draft length 6 기준 2.89배의 speculative decoding speedup을 달성했다. 양자화 면에서는 5.03 BPE 수준으로 압축하되, routed expert는 NVFP4, shared expert는 FP8, Attention은 BF16, KV cache는 FP8, SR Mamba cache는 FP16으로 파트별 정밀도를 차등 적용해 품질 손실을 최소화한다.

### 비유가 깨지는 지점 (Limit)

오케스트라 비유가 가장 먼저 삐걱거리는 지점은 리허설의 안정성이다. 실제 오케스트라는 연습 중 음이 어긋나면 지휘자가 즉시 바로잡지만, Nemotron 3 Ultra는 8T와 16T token에서 발생한 두 차례의 training divergence를 근본적으로 해결하지 못하고 마지막 깨끗한 체크포인트로 되돌리는 방식으로 우회했다. Expert routing imbalance가 divergence와 상관관계를 보인다는 분석은 있으나 인과적 해법은 제시되지 않았고, 결국 리허설은 20T token에서 강제 종료되었다. 더 긴 훈련이 가능했을 때 어떤 성능이 나왔을지는 열린 질문으로 남는다.

객원 지휘자 합동 연습(MOPD)도 만능이 아니다. 외부 지식을 끌어와야 하는 agentic task에서는 압도적이지만, 모델 스스로 긴 추론 체인을 완결해야 하는 self-contained reasoning — HLE에서 25.6→26.7, 겨우 16.9% recovery — 에서는 객원 지휘자의 가르침이 거의 전달되지 않았다. 이는 MOPD가 "교사의 출력 분포를 흉내 내는" 증류이지 "학생 내부의 사고 과정을 재구성하는" 것은 아님을 시사한다. 비유로 말하면, 지휘자가 완성된 해석을 시범 보여줄 수는 있어도 연주자의 내면적 음악성 자체를 이식하지는 못하는 셈이다.

마지막으로, 이 오케스트라의 효율은 특정 공연장에서만 발휘된다. NVFP4 압축 악보는 NVIDIA Blackwell/Hopper 아키텍처 전용이어서, 다른 하드웨어에서는 같은 속도 이점을 기대할 수 없다. 또한 decode-heavy 워크로드에서 빛나는 throughput 우위는 prefill-heavy 시나리오에서 상당히 희석되는데, 55B active parameter가 유발하는 3.2배의 FLOPs penalty가 긴 입력 처리 시 병목으로 작용하기 때문이다. 550B 총원 중 55B만 무대에 올리는 경량 편성이 바로 그 경량성 때문에 특정 조건에서 비용을 치르는 역설 — 오케스트라 비유로는 포착하기 어려운 트레이드오프다.
