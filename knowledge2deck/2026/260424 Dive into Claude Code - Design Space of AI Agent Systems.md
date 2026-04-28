[Dive into Claude Code: The Design Space of Today's and Future AI Agent Systems](https://arxiv.org/abs/2604.14228)

Jiacheng Liu, Xiaohan Zhao, Xinyi Shang, Zhiqiang Shen

> Claude Code is an agentic coding tool that can run shell commands, edit files, and call external services on behalf of the user. This study describes its comprehensive architecture by analyzing the publicly available TypeScript source code and further comparing it with OpenClaw, an independent open-source AI agent system that answers many of the same design questions from a different deployment context. Our analysis identifies five human values, philosophies, and needs that motivate the architecture (human decision authority, safety and security, reliable execution, capability amplification, and contextual adaptability) and traces them through thirteen design principles to specific implementation choices. The core of the system is a simple while-loop that calls the model, runs tools, and repeats. Most of the code, however, lives in the systems around this loop: a permission system with seven modes and an ML-based classifier, a five-layer compaction pipeline for context management, four extensibility mechanisms (MCP, plugins, skills, and hooks), a subagent delegation mechanism with worktree isolation, and append-oriented session storage. A comparison with OpenClaw, a multi-channel personal assistant gateway, shows that the same recurring design questions produce different architectural answers when the deployment context changes: from per-action safety classification to perimeter-level access control, from a single CLI loop to an embedded runtime within a gateway control plane, and from context-window extensions to gateway-wide capability registration. We finally identify six open design directions for future agent systems, grounded in recent empirical, architectural, and policy literature.

## Key Contributions

- **Systematic architecture-level reading of Claude Code's TypeScript source** — maps code to values → principles → implementation choices.
- **Values–principles–mechanisms** three-layer framework: 5 human values, 13 design principles, specific implementations.
- **Detailed catalog** of Claude Code's core subsystems: 7 permission modes + ML classifier, 5-layer compaction pipeline, 4 extensibility mechanisms, subagent delegation with worktree isolation, append-only session storage.
- **Comparative analysis with OpenClaw** (multi-channel assistant gateway) — demonstrates that deployment context, not values, drives most architectural divergence.
- **Six open directions** for future agent systems grounded in literature.

## The Five Values and Thirteen Principles

**Values:**
1. Human Decision Authority
2. Safety, Security, and Privacy
3. Reliable Execution
4. Capability Amplification (≈27% of tasks wouldn't be attempted otherwise)
5. Contextual Adaptability (auto-approve rates rise from ~20% → 40% over 750+ sessions)

**Thirteen design principles** (each answers a recurring "fork in the road" question):
deny-first with escalation • graduated trust spectrum • defense in depth • externalized programmable policy • context as scarce resource • append-only durable state • minimal scaffolding, maximal harness • values over rules • composable multi-mechanism extensibility • reversibility-weighted risk • transparent file-based configuration • isolated subagent boundaries • graceful recovery and resilience.

## Architecture Overview

**Core loop.** A simple while-loop: call model → run tools → repeat. ~1.6% of code. Described as "a Unix utility."

**Everything else (~98.4%).** Operational infrastructure around the loop:

**Seven permission modes** (`types/permissions.ts`):
`plan` → `default` → `acceptEdits` → `auto` → `dontAsk` → `bypassPermissions` → `bubble` (internal, for subagent escalation).

- `auto` mode uses an ML-based **yoloClassifier** (`yoloClassifier.ts`) with two-stage evaluation: fast pattern match → CoT reasoning over transcript + permission templates.
- Key finding: users approve **~93%** of permission prompts → approval fatigue → interactive prompts alone are an unreliable safety mechanism → automated safety layers are necessary, not optional.

**Five-layer compaction pipeline** (`query.ts:365-453`), run before every model call:
1. Budget reduction (per-message size limits on tool results)
2. Snip (lightweight trim of older segments)
3. Microcompact (fine-grained compression, cache-aware)
4. Context collapse (read-time projection)
5. Auto-compact (full model-generated semantic summary — last resort)

Each layer is cheaper than the next; you only escalate when necessary.

**Four extensibility mechanisms** (layered by context cost):
- **MCP servers** — external tools via stdio/SSE/HTTP/WebSocket/SDK; namespaced as `mcp__server__tool`.
- **Plugins** — bundles of tools + hooks + skills; registered at startup via `assembleToolPool()`.
- **Skills** — instruction bundles in `.claude/skills/`; lower context cost than plugins.
- **Hooks** — 27 event types; 5 in the permission flow (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionDenied`, `PermissionRequest`), 22 for orchestration.

**Subagent delegation.** Spawned via `AgentTool`. Isolated contexts, separate `CLAUDE.md` hierarchies, results return as summaries only (not full transcripts), sidechain transcript storage per subagent. Run in `bubble` mode (allowing escalation to parent).

**Session storage.** Append-only JSONL. Supports resume, fork, rewind.

## Comparison with OpenClaw

Same design questions, different deployment contexts → different answers:

| Dimension | Claude Code | OpenClaw |
|---|---|---|
| Scope | Focused CLI coding agent | Multi-channel personal assistant gateway |
| Trust model | Per-action safety evaluation + escalation | Perimeter-level access control at gateway boundary |
| Runtime | Single reactive loop, focused tools | Embedded runtime in gateway control plane |
| Extensions | MCP + plugins + skills + hooks | Internal tool registry + plugin architecture |
| Memory/context | Window extensions + `CLAUDE.md` hierarchy | Gateway-wide capability registration |
| Multi-agent | Subagent delegation w/ isolation | Service routing + worker coordination |

**Takeaway**: values are shared (authority, safety, reliability...); the *deployment context* determines whether safety lives at the per-action level (Claude Code) or the perimeter (OpenClaw).

## Six Open Design Directions

1. **Observability-Evaluation Gap** — silent failures; tension between graceful recovery and human awareness.
2. **Cross-Session Persistence** — sessions are currently islands; longitudinal memory + skill accumulation unsolved.
3. **Harness Boundary Evolution** — where (local/remote), when (reactive/proactive), what (action scope), with whom agents operate is underspecified.
4. **Horizon Scaling** — extend from single-session tasks to multi-session scientific programs while preserving safety.
5. **Governance at Scale** — institutional oversight, audit trails, cross-team policy enforcement.
6. **Long-Term Human Capability Preservation** — 27% capability amplification vs. risk of skill atrophy and loss of codebase understanding.

## Takeaways

- **The "agent" is the harness, not the model.** 98.4% of code is infrastructure; the decision loop is trivial. This reframes "agent engineering" as plumbing, permission UX, context compression, and extension surfaces — not LLM prompting.
- **Approval fatigue is the dominant safety failure mode.** 93% auto-approval rate means human-in-the-loop is not a reliable safety mechanism at scale. ML classifiers, hooks, and deny-first defaults exist to compensate.
- **Design principles are load-bearing code.** "Values over rules" and "reversibility-weighted risk" appear both in the whitepaper framing *and* in specific files (`yoloClassifier.ts`). This paper's main contribution is the trace from values → code.
- **Deployment context beats values** as a driver of architecture. Same goals, different product surfaces → different answers.
- **The six open directions are a research agenda** for anyone building agent platforms next — especially cross-session persistence and observability-evaluation.

## Follow-Up Questions

1. The paper claims 98.4% of code is infrastructure, 1.6% decision logic. Is this ratio stable as agents mature, or does AI-decision logic eventually grow as models become more capable?
2. The yoloClassifier's two-stage (pattern match → CoT) design trades latency for accuracy. What's the false-accept rate in practice, and what guardrails catch classifier errors?
3. Hooks have 27 event types — does this surface breed its own complexity (hook interaction bugs, ordering issues, hidden side effects)?
4. Subagent isolation prevents context inflation but loses the parent's full reasoning. When does isolation hurt more than help?
5. The five-layer compaction pipeline reads like a software-engineering kludge pile. Is there a principled replacement (e.g., learned compaction), or is the layered heuristic inherent to the problem?
6. Comparing Claude Code (per-action trust) vs. OpenClaw (perimeter trust): which model generalizes better as deployment surfaces multiply? Is the right answer "both, at different layers"?
7. The "long-term human capability preservation" direction is philosophically unusual for a systems paper. Is it actionable, or is it a normative framing that doesn't map to implementation choices?

## Answers

**1.** The 98.4/1.6 ratio is likely *temporarily* stable but will shift as models absorb more of the infrastructure role. Context compaction, permission classification, and subagent orchestration are increasingly model-delegated (e.g., auto-compact is already model-generated summaries). In 2–3 years expect the decision-logic share to grow as models become cheaper and more reliable — but the *total code* for agent infrastructure will likely grow too, just a smaller proportion. The ratio is a snapshot of the current model–infrastructure cost curve.

**2.** The paper doesn't report false-accept numbers directly. The defense-in-depth principle suggests the classifier is *one layer* — deny-first rules still fire, hooks can veto, users can interrupt. False accepts are bounded by deny rules + reversibility weighting (low-risk actions auto-approved even if misclassified, high-risk actions require additional evidence). The actual production error rate is an empirical question the paper doesn't fully answer.

**3.** Hook complexity is a real operational cost. The paper implicitly acknowledges this by categorizing hooks (5 permission-flow vs. 22 orchestration). Ordering issues, hook-induced latency, and silent failure modes (a hook suppressing output without indication) are failure surfaces mentioned in the "observability-evaluation gap" direction. The mitigation is the externalized programmable policy principle — hooks are configurable user code, so complexity is delegated outward rather than solved.

**4.** Subagent isolation hurts when the task requires coherent reasoning across subtask boundaries — e.g., when subagent A discovers a constraint that invalidates subagent B's plan, but summaries don't surface it. The "results as summaries only" design is an explicit tradeoff: context pressure wins, coherence loses. Orchestrator-level planning (parent agent synthesizes subagent summaries before acting) partially compensates. This is a known limitation shared with multi-agent systems generally.

**5.** The five-layer compaction pipeline is a classic graduated-response design pattern (cheap-first, expensive-last), which is principled even if the individual layers are heuristic. A learned compaction model would replace layers 4–5 (microcompact and auto-compact) but not layers 1–3 (budget limits and simple trims) which have bounded cost and low risk of loss. So the pipeline structure is likely inherent; only the high-cost layers will be replaced by learned methods.

**6.** Per-action trust scales when actions are diverse and context-sensitive (coding, shell commands); perimeter trust scales when users operate inside an established security domain (enterprise SSO, device trust). Both are right at different layers — the real answer is probably "perimeter at the outer layer + per-action for risky operations inside." Most future agent systems will need both, and the interesting design question is where to draw the boundary between them.

**7.** "Long-term capability preservation" is more actionable than it sounds. Concrete instantiations: (a) surfacing intermediate reasoning so users learn patterns, (b) default-off auto-approval for first-time operations, (c) educational modes that pause and explain, (d) audit logs designed for learning, not just forensics. The paper flags it as an open direction because these aren't implemented, not because they're unimplementable. This is normative *and* engineering-actionable.
