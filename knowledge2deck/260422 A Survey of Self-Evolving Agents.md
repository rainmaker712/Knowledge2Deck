[A Survey of Self-Evolving Agents: What, When, How, and Where to Evolve on the Path to Artificial Super Intelligence](https://arxiv.org/abs/2507.21046)

Huan-ang Gao, Jiayi Geng, Wenyue Hua, Mengkang Hu, Xinzhe Juan, Hongzhang Liu, Shilong Liu, Jiahao Qiu, Xuan Qi, Yiran Wu, Hongru Wang, Han Xiao, Yuhang Zhou, Shaokun Zhang, Jiayi Zhang, Jinyu Xiang, Yixiong Fang, Qiwen Zhao, Dongrui Liu, Qihan Ren, Cheng Qian, Zhenhailong Wang, Minda Hu, Huazheng Wang, Qingyun Wu, Heng Ji, Mengdi Wang

> Large Language Models (LLMs) have demonstrated remarkable capabilities across diverse tasks but remain fundamentally static, unable to adapt their internal parameters to novel tasks, evolving knowledge domains, or dynamic interaction contexts. As LLMs are increasingly deployed in open-ended, interactive environments, this static nature has become a critical bottleneck, necessitating agents that can adaptively reason, act, and evolve in real time. This paradigm shift -- from scaling static models to developing self-evolving agents -- has sparked growing interest in architectures and methods enabling continual learning and adaptation from data, interactions, and experiences. This survey provides the first systematic and comprehensive review of self-evolving agents, organizing the field around three foundational dimensions: what, when, and how to evolve. We examine evolutionary mechanisms across agent components (e.g., models, memory, tools, architecture), categorize adaptation methods by stages (e.g., intra-test-time, inter-test-time), and analyze the algorithmic and architectural designs that guide evolutionary adaptation (e.g., scalar rewards, textual feedback, single-agent and multi-agent systems). Additionally, we analyze evaluation metrics and benchmarks tailored for self-evolving agents, highlight applications in domains such as coding, education, and healthcare, and identify critical challenges and research directions in safety, scalability, and co-evolutionary dynamics. By providing a structured framework for understanding and designing self-evolving agents, this survey establishes a roadmap for advancing more adaptive, robust, and versatile agentic systems in both research and real-world deployments, and ultimately sheds light on the realization of Artificial Super Intelligence (ASI) where agents evolve autonomously and perform beyond human-level intelligence across tasks.

## Key Contributions

- **First comprehensive survey** of self-evolving agents, organized around four axes: **what, when, how, and where** to evolve.
- Taxonomy across agent components (models, memory, tools, architecture) and adaptation stages (intra-test-time, inter-test-time).
- Unified review of algorithmic designs for evolutionary adaptation: scalar rewards, textual feedback, single-agent vs. multi-agent co-evolution.
- Dedicated treatment of **evaluation metrics, benchmarks, and domain applications** (coding, education, healthcare).
- Identifies open problems in **safety, scalability, and co-evolutionary dynamics** on the path toward ASI.

## Survey Framework

**WHAT to evolve** — agent components that can be updated during deployment:
- **Model parameters** (weights, adapters, LoRA)
- **Memory** (episodic, semantic, working)
- **Tools** (tool selection, tool creation, tool-use policies)
- **Architecture** (prompt structures, planning loops, multi-agent topology)

**WHEN to evolve** — timing of adaptation:
- **Intra-test-time**: within a single task/episode (in-context updates, self-reflection)
- **Inter-test-time**: across tasks (experience replay, offline refinement, online RL)
- **Continuous / lifelong**: streaming adaptation with no clear episode boundary

**HOW to evolve** — mechanisms that drive change:
- **Scalar rewards** (RL, RLHF, RLVR, RLAIF)
- **Textual feedback** (self-critique, peer review, LLM-as-judge)
- **Single-agent** loops (self-play, self-refine, self-improvement)
- **Multi-agent** co-evolution (debate, society, adversarial pairs)

**WHERE to evolve** — domain applications: coding, education, healthcare, scientific discovery, etc.

## Cross-References in This Deck

This survey is a useful index for papers already in this collection:

- **Self-Aware RL** (2510.02752) — self-difficulty prediction + limit-breaking → maps to *scalar reward* + *intra/inter-test-time*.
- **Agentic Self-Learning** (2510.14253) — co-evolving GRM + policy + generator → maps to *multi-agent* + *scalar reward via GRM*.
- **R-Few** (2512.02472) — grounded Challenger + curriculum Solver → maps to *multi-agent* + *textual grounding + scalar reward*.
- **Self-Improving Pretraining** (260129) — evolution at pretraining time, a boundary case for *when to evolve*.
- **Active Reading** (250813) — memory/knowledge evolution within inference.

## Takeaways

- **The field has a shared vocabulary now.** Before this survey, each self-evolving-agents paper invented its own terminology. The what/when/how/where axes give a clean way to compare methods.
- **Most current work clusters in two corners**: RL-based parameter evolution (ASL, Self-Aware RL, R-Few) and memory-based evolution (long-context / RAG systems). Tool and architecture evolution are relatively underexplored.
- **Evaluation is the unsolved problem.** The authors flag that benchmarks for self-evolving agents are inadequate — most reuse static benchmarks that don't measure adaptation quality directly.
- **Safety gap**: autonomous evolution amplifies alignment risks (drift, reward hacking, emergent multi-agent collusion). The survey calls this out but doesn't resolve it.

## Follow-Up Questions

1. The survey positions self-evolution as the path to ASI. Is this framing defensible, or is it a category confusion — "adaptive models" vs. "superintelligent models"?
2. What distinguishes intra-test-time evolution from standard in-context learning? Is the distinction operationally meaningful or just terminological?
3. Memory-based and parameter-based evolution seem to compete for the same role (persist experience). When should a system designer prefer one over the other?
4. The survey enumerates four component types (model, memory, tools, architecture). Are there empirical cases where evolving architecture (vs. weights) outperforms, or is architecture evolution mostly a research aspiration?
5. Multi-agent co-evolution introduces Nash-equilibrium and collusion risks. Does the survey offer any concrete safeguards beyond naming the problem?
6. How does this survey relate to the classical "continual learning" and "meta-learning" literatures? Is self-evolving agents a genuine new paradigm or a rebranding?
7. If the survey were rewritten post-ASL/R-Few (Oct–Dec 2025), what new category would emerge that isn't currently in the taxonomy?

## Answers

**1.** The ASI framing is aspirational and rhetorically motivated rather than rigorous. Adaptive capability is necessary but not sufficient for superintelligence — an agent can evolve capably within narrow domains without approaching general superhuman performance. The survey's actual contribution is the taxonomy of *adaptive* agents, which is useful regardless of whether ASI is ever reached. Readers should treat the ASI framing as motivational scaffolding and focus on the engineering taxonomy.

**2.** Intra-test-time evolution is typically meant to include methods that modify *state persisted across the single task* (scratchpad memory, self-reflection outputs fed back into the prompt, mid-trajectory tool creation) — it's broader than in-context learning because it includes structural changes (tool inventory, memory contents), not just token-level conditioning. The distinction is meaningful when the persisted state is non-trivial; it collapses to in-context learning when the only persisted state is the prompt itself.

**3.** Parameter evolution is appropriate when the new behavior should generalize beyond the current session and when you have enough data / compute to avoid catastrophic forgetting. Memory evolution is appropriate when the knowledge is episodic, rapidly changing, or per-user (e.g., user preferences, session state). In practice the two layer: memory handles fast/specific, parameters handle slow/general. Confusing them is a common design mistake — caching session state in weights is inefficient; trying to internalize general capability via memory alone hits retrieval bottlenecks.

**4.** Architecture evolution (agents that rewrite their own prompt skeleton, add/remove sub-agents, modify planning loops) is mostly demonstrated in toy or constrained settings (AutoGen, LLM-as-OS experiments, self-modifying-agent benchmarks). Reliable closed-loop architecture evolution at scale is an open problem. The survey rightly categorizes it as a dimension but should be read as promissory rather than matured.

**5.** The survey names multi-agent risks (collusion, cascading hallucinations, feedback loops) but doesn't offer strong mitigations. Current empirical defenses are primarily (a) heterogeneous agents with conflicting incentives, (b) human verification at bounded intervals (see ASL's 1% real-data injection), (c) external verifiers outside the agent ecosystem. None of these is robustly evaluated for adversarial co-evolution. This is genuinely an open research frontier.

**6.** Self-evolving agents is a genuine paradigm extension but inherits most of its core problems from classical continual learning (catastrophic forgetting, stability-plasticity dilemma, task interference) and meta-learning (learning to learn, few-shot adaptation). The new elements are (a) LLM-specific tools/memory/architectures as evolvable surfaces, (b) multi-agent co-evolution dynamics absent in single-learner classical work, and (c) the tool-use + real-world action loop. The survey could be sharper about connecting to these predecessor fields.

**7.** A fourth major category that has crystallized in late 2025 is **"bounded-human-anchor self-evolution"** — systems that operate self-play-style but with strategically placed minimal human signals (R-Few's 5% anchors, ASL's 1% verification injection, Self-Aware RL's external-solver queries). This is distinct from both pure self-play (which plateaus) and heavily supervised training (which is data-hungry). It deserves its own axis because the design question is no longer "self-play yes/no" but "what is the minimal human signal + where do you inject it + how do you amortize it."
