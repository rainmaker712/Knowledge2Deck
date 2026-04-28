[Scaling Test-Time Compute for Agentic Coding](https://arxiv.org/abs/2604.16529)

Joongwon Kim, Wannan Yang, Kelvin Niu, Hongming Zhang, Yun Zhu, Eryk Helenowski, Ruan Silva, Zhengxing Chen, Srinivasan Iyer, Manzil Zaheer, Daniel Fried, Hannaneh Hajishirzi, Sanjeev Arora, Gabriel Synnaeve, Ruslan Salakhutdinov, Anirudh Goyal

> Test-time scaling has become a powerful way to improve large language models. However, existing methods are best suited to short, bounded outputs that can be directly compared, ranked or refined. Long-horizon coding agents violate this premise: each attempt produces an extended trajectory of actions, observations, errors, and partial progress taken by the agent. In this setting, the main challenge is no longer generating more attempts, but representing prior experience in a form that can be effectively selected from and reused. We propose a test-time scaling framework for agentic coding based on compact representations of rollout trajectories. Our framework converts each rollout into a structured summary that preserves its salient hypotheses, progress, and failure modes while discarding low-signal trace details. This representation enables two complementary forms of inference-time scaling. For parallel scaling, we introduce Recursive Tournament Voting (RTV), which recursively narrows a population of rollout summaries through small-group comparisons. For sequential scaling, we adapt Parallel-Distill-Refine (PDR) to the agentic setting by conditioning new rollouts on summaries distilled from prior attempts. Our method consistently improves the performance of frontier coding agents across SWE-Bench Verified and Terminal-Bench v2.0. For example, by using our method Claude-4.5-Opus improves from 70.9% to 77.6% on SWE-Bench Verified (mini-SWE-agent) and 46.9% to 59.1% on Terminal-Bench v2.0 (Terminus 1). Our results suggest that test-time scaling for long-horizon agents is fundamentally a problem of representation, selection, and reuse.

## Key Contributions

- **Reframes test-time scaling for long-horizon agents** as a *representation-and-reuse* problem, not a *sample-more-attempts* problem.
- Introduces **rollout summaries**: a structured compression of each trajectory keeping salient hypotheses, progress markers, and failure modes while discarding low-signal trace tokens.
- **Recursive Tournament Voting (RTV)** — parallel scaling via recursive small-group comparisons over summaries (rather than over full trajectories, which don't fit in context).
- **Agentic Parallel-Distill-Refine (PDR)** — sequential scaling where new rollouts are conditioned on summaries distilled from prior attempts.
- Reports strong gains on frontier coding agents across SWE-Bench Verified and Terminal-Bench v2.0.

## Method / Architecture

**Problem setup.** Long-horizon coding agents (SWE-Bench Verified, Terminal-Bench) produce trajectories of actions + observations + errors + partial edits. Each trajectory is thousands of tokens, so naive parallel voting (N trajectories → pick best) doesn't fit in context and sequential refinement (condition on prior full trace) wastes tokens on low-signal tokens.

**Rollout Summaries.** Each trajectory is compressed into a structured summary containing:
- Salient **hypotheses** the agent pursued.
- **Progress** made (what was tried, what worked/partially-worked).
- **Failure modes** (where it got stuck, why).
- Low-signal trace details (command echoes, long stack traces, filesystem listings) are dropped.

This gives a compact, comparable, reusable unit for downstream selection and conditioning.

**Parallel scaling — Recursive Tournament Voting (RTV).**
- Generate N independent rollouts, summarize each.
- Compare summaries in small groups (tournament bracket) recursively.
- The judge LLM picks the best summary in each group; winners advance.
- Final winner's underlying solution is submitted.
- RTV's advantage over flat N-way voting: judge context stays small at each stage; compute scales as O(N log N) comparisons with bounded context per comparison.

**Sequential scaling — Agentic Parallel-Distill-Refine (PDR).**
- Classical PDR for short outputs: generate in parallel, distill critique, refine sequentially.
- Agentic adaptation: generate parallel rollouts → summarize each → distill summaries into guidance → new rollout is conditioned on distilled guidance (instead of raw traces).
- Lets the agent inherit prior exploration without paying full-trace context cost.

**Combination.** Parallel (RTV) and sequential (PDR) are complementary — one for breadth, one for depth — and can be composed for further gains.

## Results

Main reported numbers (Claude-4.5-Opus):

| Benchmark | Agent harness | Baseline | With method |
|---|---|---|---|
| SWE-Bench Verified | mini-SWE-agent | 70.9% | **77.6%** (+6.7) |
| Terminal-Bench v2.0 | Terminus 1 | 46.9% | **59.1%** (+12.2) |

- Gains are "consistent" across frontier coding agents per the abstract.
- The Terminal-Bench gain is unusually large — the agent domain appears to benefit more from structured trajectory reuse than the SWE-Bench one.
- Full paper (70 pp, 26 figures, 12 tables) presumably contains model-by-model breakdowns and RTV/PDR ablations.

## Takeaways

- **Test-time scaling ≠ more samples, eventually.** For agents, the binding constraint is how well you can *compare* and *reuse* past attempts, not how many you can afford to run.
- **Summarization as a first-class primitive.** Treating the rollout summary as the unit of computation (instead of the full trace) unlocks both parallel voting and sequential refinement within a fixed context budget.
- **Tournament voting beats flat voting** at scale because it keeps judge context bounded — a generalization of pairwise-elo ideas to small-group comparisons.
- **Practical implication for agent infra**: persist structured summaries (not full logs) as the artifact for replay, ensemble, and retry loops.
- Links directly to the self-evolving-agent thread: the same "compact experience → reuse" pattern appears in memory modules of self-evolving systems; here it's applied at inference time rather than training time.

## Follow-Up Questions

1. What does a rollout summary actually contain at the token level? Is it free-form prose, a structured schema (JSON/YAML), or LLM-guided extraction — and does the schema matter for downstream selection quality?
2. RTV uses small-group comparisons — what's the optimal group size, and how sensitive are results to the choice? Pairwise (k=2) vs. k=4 vs. k=8 have very different tradeoffs.
3. The judge that picks winners in RTV is presumably also an LLM. Does judge quality dominate the result, and what happens when the judge is the same model as the solver (shared blind spots)?
4. Terminal-Bench gains (+12.2) dwarf SWE-Bench gains (+6.7). Why — is Terminal-Bench's longer trajectories just more compressible, or are there structural reasons (more redundant exploration paths)?
5. PDR conditions new rollouts on distilled summaries — but how does this avoid *over-anchoring* the new rollout to the failure modes of prior attempts (path dependence)?
6. Compute cost: N rollouts + O(N log N) comparisons + summaries is substantial. What's the cost-normalized gain (accuracy per token) vs. just running the agent with a longer context or bigger model?
7. This approach assumes trajectory comparisons are meaningful — what happens in benchmarks where the right answer is highly bimodal (either completely solved or not), and ranking partial progress is misleading?

## Answers

**1.** The abstract specifies three fields (hypotheses, progress, failure modes) but not the exact encoding. Likely an LLM-guided extraction producing structured text — not necessarily strict JSON, because the summary needs to preserve enough semantic nuance for the judge to compare. A strict schema would make summaries easier to diff but might discard the signal that makes one attempt genuinely more promising than another. The 70-page full paper presumably ablates this — worth reading the "summary format" section carefully.

**2.** Small-group comparisons (k = 3–5 is typical in tournament-voting literature) balance context cost vs. information per comparison. Pairwise (k=2) wastes rounds on near-identical summaries; k=8 runs into context-window pressure and judge degradation on long comparisons. The paper's choice of "small-group" suggests k somewhere in that range. Sensitivity probably matters for flat-population cases (many near-equivalent summaries) but less so when there's a clear dominant attempt.

**3.** Judge quality is almost certainly the binding constraint. When the judge LLM is the same family/scale as the solver, it may systematically undervalue attempts that look superficially different from its own preferences — a known meta-critic failure mode. A practical mitigation is using a stronger model as judge or using multiple judge roles with disagreement signal. The paper's harness details (which model judges which) would clarify this.

**4.** Terminal-Bench v2.0 tasks involve long terminal sessions with extensive exploration overhead — command discovery, path navigation, state checks — much of which is low-signal and highly compressible. Summaries likely discard a larger fraction of trajectory tokens than in SWE-Bench, which makes the summary representation proportionally more informative. SWE-Bench tasks have denser code-edit content where compression is harder. Structural difference in trajectory "density" is the most plausible driver.

**5.** Path dependence is a real risk: conditioning on prior-attempt failure summaries can bias the new rollout toward "avoid what failed" rather than "explore freely." PDR's adaptation likely includes some form of diversity injection (e.g., multiple parallel rollouts with different distilled guidance, or explicitly instructing the new rollout to try novel hypotheses). Without an explicit novelty reward, PDR could get stuck in a local basin defined by the first few attempts' failure modes. This is a classic exploration-exploitation tension carried over from RL into test-time scaling.

**6.** This is the key practical question the paper must address. RTV with N rollouts costs N × (avg trajectory tokens) + O(N log N) × (2 × summary tokens). For large N, the summarization + tournament overhead is small relative to the rollout cost, so marginal scaling is favorable. But vs. a single stronger model or larger context, the comparison depends on the model's price curve — at the frontier, running N=8 of Claude-4.5-Opus with RTV is very expensive. The 70-page paper presumably has Pareto-frontier analysis on cost vs. accuracy.

**7.** Bimodal tasks (solved/unsolved with no partial credit) are actually where this approach should shine most, because the judge only needs to recognize "this summary reports verified success" vs. "this summary reports failure or uncertainty." The harder case is *semi-continuous* tasks with misleading partial progress — e.g., an attempt that edits many files but breaks tests can look more impressive than a minimal correct patch. The summary's "progress" field is where this bias could be encoded, and judge calibration against actual test outcomes would be the natural guardrail.
