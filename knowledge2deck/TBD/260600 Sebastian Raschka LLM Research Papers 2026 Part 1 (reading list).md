[LLM Research Papers: The 2026 List (January to May), Part 1 — Sebastian Raschka](https://magazine.sebastianraschka.com/p/llm-research-papers-2026-part1)

Sebastian Raschka (Sebastian Raschka's *Ahead of AI* / Substack)

> As some of you know, I have the long-running habit of keeping a running list of research papers I want to read, revisit, or cite in future articles and projects. Please do not treat this as a complete list of everything published this year...this is a curated reference list based on papers I found interesting or relevant for my own work. This year, the list is again heavy on reasoning models, reinforcement learning, and efficient inference, because I am biased towards bookmarking papers.

<!-- Panel Verdict: PROCEED -->
<!-- Type: reading-list-index -->

> [!NOTE]
> 이 노트는 **단일 논문 분석이 아니라** Sebastian Raschka의 큐레이션 reading list(2026년 1~5월)를 정리한 *index 노트*다. paper-ingest v4의 단일 비유 4-섹션 contract를 의도적으로 따르지 않으며, downstream cross-paper-analysis 인덱스를 오염시키지 않도록 `Metaphor` 코멘트도 두지 않는다. 개별 논문을 정식 노트로 만들 때는 해당 arXiv URL로 `paper-ingest`를 다시 돌릴 것.

## 무엇인가

Raschka가 10개 카테고리로 묶어 둔 2026년 1~5월 LLM 논문 큐레이션 리스트의 **Part 1**이다. 본인이 글·책·강의에서 다시 찾아 인용하기 위한 개인 북마크 모음이며, "완전한 목록이 아니라 내가 흥미롭거나 관련 있다고 본 것들"이라고 못 박는다. 올해 리스트는 reasoning model, reinforcement learning, efficient inference 쪽에 무게가 실려 있다.

전체 카테고리(10개):

1. Architecture and Model Design
2. Efficient Training and Scaling
3. Inference Efficiency and KV Cache
4. Sparse Attention and Long Context
5. Reasoning and Test-Time Compute
6. Reinforcement Learning and RLVR
7. Agent Systems and Tool Use
8. Coding Agents and Software Engineering
9. Diffusion Language Models
10. Model Evaluation and Benchmarks

> [!WARNING]
> **Paywall 제약.** 무료로 접근 가능한 범위는 **Section 1 (Architecture and Model Design) 전체와 Section 2 헤더까지**였다. Section 2 본문부터 Section 10까지는 paywall 뒤에 있어 이 노트에 담지 못했다. 아래 목록은 *접근 가능했던 부분만* 완전하며, 나머지는 미수집 상태다.

## Section 1 — Architecture and Model Design (수집 완료, 22편)

| # | 논문 | 날짜 | arXiv |
|---|------|------|-------|
| 1 | Deep Delta Learning | 1 Jan | [2601.00417](https://arxiv.org/abs/2601.00417) |
| 2 | MiMo-V2-Flash Technical Report | 6 Jan | [2601.02780](https://arxiv.org/abs/2601.02780) |
| 3 | Ministral 3 | 13 Jan | [2601.08584](https://arxiv.org/abs/2601.08584) |
| 4 | Scaling Embeddings Outperforms Scaling Experts in Language Models | 29 Jan | [2601.21204](https://arxiv.org/abs/2601.21204) |
| 5 | LatentLens: Revealing Highly Interpretable Visual Tokens in LLMs | 30 Jan | [2602.00462](https://arxiv.org/abs/2602.00462) |
| 6 | ERNIE 5.0 Technical Report | 4 Feb | [2602.04705](https://arxiv.org/abs/2602.04705) |
| 7 | ViT-5: Vision Transformers for the Mid-2020s | 8 Feb | [2602.08071](https://arxiv.org/abs/2602.08071) |
| 8 | Step 3.5 Flash: Open Frontier-Level Intelligence with 11B Active Parameters | 11 Feb | [2602.10604](https://arxiv.org/abs/2602.10604) |
| 9 | Nanbeige4.1-3B: A Small General Model That Reasons, Aligns, and Acts | 12 Feb | [2602.13367](https://arxiv.org/abs/2602.13367) |
| 10 | Symmetry in Language Statistics Shapes the Geometry of Model Representations | 16 Feb | [2602.15029](https://arxiv.org/abs/2602.15029) |
| 11 | GLM-5: From Vibe Coding to Agentic Engineering | 17 Feb | [2602.15763](https://arxiv.org/abs/2602.15763) |
| 12 | Arcee Trinity Large Technical Report | 18 Feb | [2602.17004](https://www.arxiv.org/abs/2602.17004) |
| 13 | The Spike, the Sparse and the Sink: Anatomy of Massive Activations and Attention Sinks | 4 Mar | [2603.05498](https://arxiv.org/abs/2603.05498) |
| 14 | Tiny Aya: Bridging Scale and Multilingual Depth | 12 Mar | [2603.11510](https://arxiv.org/abs/2603.11510) |
| 15 | Attention Residuals | 15 Mar | [2603.15031](https://arxiv.org/abs/2603.15031) |
| 16 | Mamba-3: Improved Sequence Modeling Using State Space Principles | 16 Mar | [2603.15569](https://arxiv.org/abs/2603.15569) |
| 17 | Attention to Mamba: A Recipe for Cross-Architecture Distillation | 31 Mar | [2604.14191](https://arxiv.org/abs/2604.14191) |
| 18 | Nemotron 3 Super: Open, Efficient MoE Hybrid Mamba-Transformer Model for Agentic Reasoning | 13 Apr | [2604.12374](https://arxiv.org/abs/2604.12374) |
| 19 | ZAYA1-8B Technical Report | 6 May | [2605.05365](https://arxiv.org/abs/2605.05365) |
| 20 | Delta Attention Residuals | 13 May | [2605.18855](https://arxiv.org/abs/2605.18855) |
| 21 | Gated DeltaNet-2: Decoupling Erase and Write in Linear Attention | 21 May | [2605.22791](https://arxiv.org/abs/2605.22791) |
| 22 | The MiniMax-M2 Series: Mini Activations Unleashing Max Real-World Intelligence | 25 May | [2605.26494](https://arxiv.org/abs/2605.26494) |

### 코퍼스와의 겹침

- **#17 Attention to Mamba** (2604.14191)은 이미 코퍼스에 정식 노트로 존재한다 → [[260401 Attention to Mamba A Recipe for Cross-Architecture Distillation]]. (Mamba-3(#16), Delta Attention Residuals(#20), Gated DeltaNet-2(#21) 등 linear-attention/SSM 계열과 함께 읽으면 좋다.)
- #18 Nemotron 3 Super는 코퍼스의 Nemotron 계열 노트와 *모델 라인이 다를 수 있으니* 정식 ingest 전 arXiv로 확인 권장.

## 다음 작업

1. Section 1에서 정식 노트로 만들 논문을 골라 각 arXiv URL로 `paper-ingest` 재실행.
2. **Part 1 후속 수집**: Section 2~10은 paywall로 미수집. 구독 접근이 가능해지면 동일 형식으로 이 노트를 확장하거나, Part 2/별도 노트로 분리.
