[Youtu-LLM: Unlocking the Native Agentic Potential for Lightweight Large Language Models](https://arxiv.org/abs/2512.24618)

Authors: Junru Lu, Jiarui Qin, Lingfeng Qiao, Yinghui Li, Xinyi Dai, Bo Ke, Jianfeng He, Ruizhi Qiao, Di Yin, Xing Sun, Yunsheng Wu, Yinsong Liu, Shuangyin Liu, Mingkong Tang, Haodong Lin, Jiayi Kuang, Fanxu Meng, Xiaojuan Tang, Yunjia Xi, Junjie Huang, Haotong Yang, Zhenyi Shen, Yangning Li, Qianwen Zhang, Yifei Yu, Siyu An, Junnan Dong, Qiufeng Wang, Jie Wang, Keyu Chen, Wei Wen, Taian Guo, Zhifeng Shen, Daohai Yu, Jiahao Li, Ke Li, Zongyi Li, Xiaoyu Tan

> We introduce Youtu-LLM, a lightweight yet powerful language model that harmonizes high computational efficiency with native agentic intelligence. Unlike typical small models that rely on distillation, Youtu-LLM (1.96B) is pre-trained from scratch to systematically cultivate reasoning and planning capabilities. The key technical advancements are as follows: (1) Compact Architecture with Long-Context Support: Built on a dense Multi-Latent Attention (MLA) architecture with a novel STEM-oriented vocabulary, Youtu-LLM supports a 128k context window. This design enables robust long-context reasoning and state tracking within a minimal memory footprint, making it ideal for long-horizon agent and reasoning tasks. (2) Principled "Commonsense-STEM-Agent" Curriculum: We curated a massive corpus of approximately 11T tokens and implemented a multi-stage training strategy. By progressively shifting the pre-training data distribution from general commonsense to complex STEM and agentic tasks, we ensure the model acquires deep cognitive abilities rather than superficial alignment. (3) Scalable Agentic Mid-training: Specifically for the agentic mid-training, we employ diverse data construction schemes to synthesize rich and varied trajectories across math, coding, and tool-use domains. This high-quality data enables the model to internalize planning and reflection behaviors effectively. Extensive evaluations show that Youtu-LLM sets a new state-of-the-art for sub-2B LLMs. On general benchmarks, it achieves competitive performance against larger models, while on agent-specific tasks, it significantly surpasses existing SOTA baselines, demonstrating that lightweight models can possess strong intrinsic agentic capabilities.

***

1. Core Research Question
Can lightweight LLMs acquire strong agentic capabilities through pre-training rather than post-training augmentation?

The Answer: Yes. Youtu-LLM (1.96B) demonstrates that native agentic intelligence can be built from scratch.

Existing Limitations: Previous methods relied on distillation, instruction tuning, or simple architectural tweaks, which often resulted in superficial reasoning capabilities.

2. Strategic Data Engineering
Youtu-LLM emphasizes a breakthrough in data engineering rather than radical architectural changes.

Scale: Over 200B tokens of specialized agentic data (an exceptionally high ratio for a 1.9B model).

STEM-Focused Tokenizer: Aligned with current trends to prioritize STEM and logical reasoning.

Quality Control: Utilizes multi-dimensional classification and filtering (similar to the DeepSeek-R1 semi-automation approach) to ensure high-standard data quality.

3. Agentic Trajectory Data (The "Thinking" Engine)
The model is trained on diverse trajectories to move beyond simple text generation:

Agentic CoT (25B): Analysis → Planning → Action → Reflection.

Math & Code (90B): Includes Math Trajectories (20B) and Code Execution (70B) focusing on task-context-action loops.

Deep Research (60B): Long-form research trajectories.

Tool Use (25B): Strategic planning and API interaction.

4. Refining Agentic CoT
To solve the common "redundancy and repetition" issues in raw CoT, Youtu-LLM uses a Rewriting Paradigm:

Reasoning & Generation: Producing initial thoughts.

Curation & Extraction: Identifying core logic.

Synthesis & Assembly: Reconstructing a refined, concise reasoning path.

5. Architecture & Token Design
Dense MLA (Multi-Head Latent Attention): Uses DeepSeek-V3 technology (MLA > GQA) for superior efficiency, specifically optimized for on-device performance.

Tokenizer Design: * Uses a GPT-4o style (o200k) base.

CJK Support: Robust handling of Chinese, Japanese, and Korean.

Numeric Tokens: Atomic digit tokens (0-9) for better mathematical precision.

Multi-Stage Training: A 4-stage curriculum:

Common Knowledge → STEM & Coding → Mid (Context Extension) → Agentic Mid (Final Alignment).

## Follow-Up Questions

1. Youtu-LLM is pre-trained from scratch rather than distilled from a larger model. What are the theoretical and practical advantages of building agentic capability through pre-training versus distillation, and under what circumstances might distillation still be preferred for a sub-2B model?

2. The "Commonsense-STEM-Agent" curriculum progressively shifts data distribution across training stages. Why is the ordering of these stages important — what would happen if agentic data were introduced at the beginning of training rather than at the end?

3. The Rewriting Paradigm (Reasoning → Curation → Synthesis) is used to address redundancy in raw Chain-of-Thought trajectories. How does this approach differ from simply filtering out low-quality CoT examples, and what kinds of reasoning errors does it specifically target?

4. Youtu-LLM uses Multi-Head Latent Attention (MLA) rather than Grouped Query Attention (GQA). What are the key trade-offs between these attention mechanisms in terms of memory footprint, inference speed, and representational capacity — especially at the sub-2B parameter scale?

5. The model uses atomic digit tokens (0–9) rather than subword tokenization for numbers. How does this design choice affect mathematical reasoning and arithmetic precision, and what are the potential downsides for tasks that involve large numbers or numeric formatting?

6. Youtu-LLM allocates roughly 200B tokens of agentic data — a very high ratio for a 1.9B model. What risks does this heavy specialization introduce, such as catastrophic forgetting of general language capabilities, and how does the curriculum design attempt to mitigate these risks?

7. The paper claims state-of-the-art performance on agent-specific tasks for sub-2B models. What benchmarks or evaluation dimensions would you consider most critical for validating genuine agentic intelligence versus task-specific memorization, and are there limitations in the current evaluation methodology?

## Answers

**1.** Pre-training from scratch allows the model to develop reasoning and planning as fundamental representational capacities rather than as surface-level behaviors grafted on top of a general language model. With distillation, the student model is constrained to mimic the output distribution of a larger teacher, which may encode reasoning shortcuts that work for the teacher's parameter scale but don't generalize when compressed into fewer parameters. The practical advantage of scratch training is that the entire compute budget can be directed toward the specific data curriculum that builds the desired capabilities, without the distributional mismatch of a teacher model. Distillation might still be preferred when compute budgets are very tight, when a strong teacher model already exists for the exact target task, or when time-to-deployment is the primary constraint — since distillation typically converges faster and requires less curated data than building capabilities from scratch.

**2.** The ordering of the curriculum is critical because earlier training stages establish the representational foundations that later stages build upon. Commonsense knowledge provides a broad linguistic and world-model base; STEM and coding training then develops structured reasoning and formal logic; and agentic data finally teaches planning and tool use on top of these already-consolidated capabilities. Introducing agentic data early would be analogous to teaching planning before the model has internalized the underlying knowledge the plans operate on — the model would lack the factual and reasoning grounding to form coherent, accurate task-action-reflection trajectories. Empirically, this kind of out-of-order curriculum tends to produce models that mimic agentic formatting without the underlying cognitive structure, resulting in superficial rather than deep agentic alignment.

**3.** Simple filtering removes entire CoT examples that fail quality thresholds, which discards the computational work and can create data scarcity for rare reasoning types. The Rewriting Paradigm instead takes a raw trajectory — even one with redundancies — and restructures it: the curation step identifies the logically essential steps, and the synthesis step reassembles them into a concise, coherent chain. This specifically targets errors like circular reasoning, unnecessary repetition of prior context, and verbose hedging that adds length without adding logical content. The result is a higher signal-to-noise ratio in the training data without sacrificing coverage, since imperfect but recoverable trajectories are rehabilitated rather than discarded.

**4.** MLA compresses the key-value cache into a low-dimensional latent space shared across heads, which dramatically reduces the KV cache memory footprint compared to GQA and especially MHA — particularly important during long-context inference at sub-2B scale where memory is the primary bottleneck. GQA reduces the number of key-value heads while keeping each head's dimension the same, offering a simpler trade-off. MLA's latent compression can achieve better memory efficiency but introduces a decoding step to reconstruct full-dimensional keys and values, which adds a small computational overhead. At sub-2B scale, MLA's memory advantage is especially valuable since these models are often deployed on constrained devices, and the representational capacity gained through the shared latent space can compensate for the smaller total parameter count.

**5.** Atomic digit tokenization (0–9) ensures that every multi-digit number is represented as a sequence of individual digit tokens, giving the model a consistent, structured view of numerical values that is invariant to number length. This allows the model to perform digit-by-digit arithmetic operations that map naturally onto the sequence-generation process, improving precision on tasks like long multiplication or modular arithmetic. The downside is token inefficiency: representing a number like "1024" requires four tokens instead of potentially one, which increases sequence lengths and thus inference cost. Additionally, the model may struggle with tasks involving formatted numbers (currency, dates, scientific notation) where the semantic meaning of the format matters, since breaking numbers into digits can fragment the contextual cues that indicate how a number should be interpreted.

**6.** The primary risk is catastrophic forgetting of the general linguistic and world knowledge built in earlier training stages, since the agentic data distribution is very different from the broad pre-training distribution. The curriculum design mitigates this by staging the specialization: general commonsense is trained first and consolidated before STEM and agentic data is introduced, so the model's general representations are well-established before the distribution shifts. Additionally, the agentic mid-training stage is positioned last rather than interleaved, which means it fine-tunes on top of a stable foundation rather than competing with general knowledge acquisition during the same phase. Residual general capability is maintained because the earlier-stage data is much larger in total (the ~11T token corpus is predominantly non-agentic), so the model's weights are heavily shaped by general content even before specialization begins.

**7.** The most critical benchmarks for validating genuine agentic intelligence are those that require multi-step planning over novel environments — tasks where the model must decide actions, observe consequences, and adapt (e.g., WebArena, AgentBench, OSWorld) — rather than single-turn question answering. Evaluation should measure whether the model can recover from unexpected intermediate states (testing reflection), generalize to tool APIs not seen during training (testing transfer), and handle long-horizon tasks where early errors compound (testing robustness). A key limitation in the current methodology is that many agentic benchmarks have limited trajectory diversity, making it difficult to rule out that high performance reflects trajectory-format memorization rather than genuine planning. The paper could be strengthened by evaluating on out-of-distribution agentic scenarios or comparing against models trained without the agentic mid-training phase on the same benchmarks to isolate the contribution of that training stage.