[Seed-Coder: Let the Code Model Curate Data for Itself](https://arxiv.org/abs/2506.03524)

[Slides](https://docs.google.com/presentation/d/15Qcj7_B_pRufyr_sXP701-rG5ymR6hjNPJXZi5qOZWg/edit?usp=sharing)

ByteDance Seed (Yuyu Zhang, Jing Su, Yifan Sun, Chenguang Xi, Xia Xiao, Shen Zheng, Anxiang Zhang, Kaibo Liu, Daoguang Zan, Tao Sun, Jinhua Zhu, Shulin Xin, Dong Huang, Yetao Bai, Lixin Dong, Chao Li, Jianchong Chen, Hanzhi Zhou, Yifan Huang, Guanghan Ning, Xierui Song, Jiaze Chen, Siyao Liu, Kai Shen, Liang Xiang, Yonghui Wu)

> 8.2B Llama-3 architecture code LM을 6T tokens로 학습하되, hand-crafted regex/heuristic 대신 **fine-tuned 1.3B Llama 2 quality scorer**가 readability/modularity/clarity/reusability 4축으로 점수를 매겨 GitHub 파일 하위 ~10%만 보수적으로 절단하는 *filter-only model-centric* 큐레이션 파이프라인. Base/Instruct(3M SFT + ~20K DPO with sandbox unit-test self-correction)/Reasoning(LongCoT + GRPO 250 step, **>87.5% 정답률 문제 제거 curriculum**, 16K@16samples→32K@32samples two-phase) 3종 변형을 공개. HumanEval **77.4 (base) / 84.8 (instruct)**, MHPP **36.2** (Qwen2.5-Coder-14B 동급), MultiPL-E 75.3 (13개 언어), Needle-in-Code 100% @ 32K 달성. SwallowCode의 *transform-and-retain* rewrite 라인과 정확히 대비되는 "rewrite 비용 없는 scoring-only" 베팅이며, 인용한 *Bitter Lesson* 수사와 달리 **curator 자체의 supervision source · filter ablation 부재**가 가장 큰 검증 공백.

## Key Contributions

- **4-axis rubric decomposition + 보수적 10% 절단 (R1 Novelty + R2 Technical)**: 단일 perplexity나 hand-crafted regex가 아닌 **readability / modularity / clarity / reusability** 4축을 1.3B Llama 2 scorer로 분해 평가. 4축이 약한 상관을 갖도록 설계되어 "syntactically valid but pedagogically poor"(minified one-liner, golf-style 코드) 류를 잡아낸다. **bottom decile 절단**은 OpenCoder의 공격적 필터링(상위 ~30% 잔존)과 정반대 방향 — 6T 규모에서는 distribution coverage가 quality density보다 우선한다는 경험적 베팅. SwallowCode의 *transform-and-retain*과 함께 "model curates data" 패러다임의 두 분기(filter-only vs filter+rewrite)를 명확히 구분.

- **GRPO curriculum의 87.5% correctness ceiling + 16K→32K two-phase (R2 Technical)**: Reasoning variant의 가장 재현 가능한 novelty. **>87.5% 정답률 문제 제거**(16-sample rollout 기준 14/16 이상)는 GRPO의 group-relative normalization이 advantage variance ≈ 0인 구간에서 zero gradient를 만드는 문제를 차단해, **policy의 current capability frontier에 trajectory budget을 집중**시키는 implicit difficulty-adaptive sampling. **90 step @ 16K/16samples → 160 step @ 32K/32samples**의 phased scaling은 LongCoT trajectory가 32K로 자연 확장되기 전에 16K에서 reasoning skeleton을 안정화한 뒤 sample 수를 두 배로 늘려 longer trajectory variance를 보상. lr 1e-6, clip 0.28(PPO 표준 0.2 대비 완화), temp 0.6 — exploration은 sampling temperature, conservatism은 lr이 담당하는 분리 설계.

- **8B 규모에서 ~14B/V2-236B와 경쟁 (R3 Impact)**: Instruct 변형이 MHPP **36.2 pass@1**으로 Qwen2.5-Coder-14B(36.7)·DeepSeek-Coder-V2-236B(31.9) 동급. HumanEval+ 68.3(base) / 84.8(instruct), BigCodeBench 53.3 full · 26.4 hard, CrossCodeEval 53.7 EM, RepoEval 50.8 EM, MultiPL-E 75.3 평균. Needle-in-Code 100% @ 32K로 long-context retrieval 검증. 6T tokens commodity scale을 8B 모델에 효율적으로 압축한 점이 enterprise 채택 시 reference baseline 가치 — 단, **6T 자체가 Qwen2.5-Coder의 5.5T보다 큰 점이 비교 fairness를 침해**한다는 점은 R4 지적 참조.

- **Curator 부트스트래핑 회귀 + filter ablation 부재 (R4 Critical)**: ① **1.3B scorer의 fine-tuning label 출처가 불투명** — (a) human label이라면 "model-centric" 슬로건과 모순(노동을 한 단계 위로 옮긴 것), (b) GPT-4 등 더 큰 LLM이 라벨링했다면 *distillation*이고 *Bitter Lesson* 인용 부적절, (c) 휴리스틱 규칙이라면 hand-crafted rule을 1.3B 모델에 압축한 것. ② **filter ablation 결정적으로 부재** — random 10% drop, perplexity-only filter, dedup-only baseline과의 동일-token-budget 비교가 없으면 6T 학습 효과 중 filter 기여도와 단순 scale 효과를 분리 불가. **반증 가능 형태**: random 10% drop과 LLM-filter의 HumanEval 차이가 1pp 이내라면 핵심 기여는 사실상 없음. ③ HumanEval/MBPP saturation + LiveCodeBench v6·SWE-bench Verified·BigCodeBench-Hard 결과 누락은 contamination-resistant 검증 공백. ④ 250 RL step + CodeContests/ICPC-only warmup은 현대 reasoning RL 표준(수천 step, multi-domain) 대비 표면적 — narrow distribution overfit 가능성.

- **데이터 가공 스펙트럼의 새 좌표 (R5 Relevance)**: Knowledge2Deck의 데이터 큐레이션 스펙트럼 — `hand-crafted rules (StarCoder, Qwen2.5-Coder 초기) → LLM filter (Seed-Coder) → LLM rewrite (SwallowCode/Nemotron-CC) → LLM synthesis (Phi-1)` — 에서 **filter 좌표를 정량 채움**. SwallowCode와 정확히 paired comparison을 가능하게 하는 첫 사례 (rewrite 비용 없이 scoring만으로 6T 규모에서 SOTA 근접 가능한가?). Nemotron-CC가 web 도메인에서 prompt-engineered 70B rewriter로 신호를 *주입*하는 것과 달리, code는 syntactic ground truth(compile/test pass)가 있어 1.3B scorer로 *선택*만 해도 충분하다는 가설을 만든다. Reasoning variant는 OctoThinker(mid-training scaffolds RL)·Front-Loading Reasoning·Kimi-Dev(agentless skill prior)와 동일 좌표계에서 위치 비교 가능.

## Method (요약)

### Pretraining (6T tokens)

| 데이터 카테고리 | 토큰 규모 | 처리 |
|---|---|---|
| File-level codes | ~1T | 1.3B Llama 2 scorer 4축 평가, bottom 10% 제거 |
| Repository-level codes | (포함) | 140K high-quality repos에서 추출 |
| Commits data | ~100B | 74M commits |
| Code-related web data | ~1.2T | Common Crawl 필터링 |

- **Quality filter**: 1.3B Llama 2 fine-tune scorer (readability/modularity/clarity/reusability)
- **Dedup**: SHA256 exact + MinHash near-dup, repo·file 양층
- **Architecture**: Llama 3 design, 8.2B params, 36 layers, hidden 4096, GQA(32 query heads / 8 KV heads)
- **Context**: 8K regular pretraining → 32K continued
- **FIM**: SPM mode 50% (regular) → 10% (continued)

### Post-training: Instruct

- **SFT**: 3M instruction-response pairs (synthetic from curated GitHub + Jupyter/Markdown/StackExchange hybrid)
- **Filter**: rule-based (Tree-sitter syntax) + model-based scoring + sandbox 난이도 필터
- **Self-correction**: unit test 통과까지 iterative 또는 max attempts
- **DPO**: ~20K preference pairs (challenging examples)

### Post-training: Reasoning

- **Warmup**: CodeContests + ICPC, rejection-sampled correct solutions
- **RL**: GRPO, 250 step total
  - Phase 1: 90 step × 16K seq × 16 samples
  - Phase 2: 160 step × 32K seq × 32 samples
- **Curriculum**: >87.5% correctness 문제 제거 (advantage variance collapse 차단)
- **Hyper**: batch 128, lr 1e-6, temp 0.6, clip ratio 0.28

### Key Results

| Benchmark | Seed-Coder-8B | 비교 |
|---|---|---|
| HumanEval (base) | 77.4 | Qwen2.5-Coder-7B 72.0, Llama-3.1-70B 54.9 |
| HumanEval+ (base) | 68.3 | — |
| MBPP (base) | 68.3 | — |
| HumanEval (instruct) | 84.8 | Qwen3-8B 동급 |
| **MHPP (instruct)** | **36.2** | **Qwen2.5-Coder-14B 36.7 / DeepSeek-Coder-V2-236B 31.9** |
| BigCodeBench | 53.3 / 26.4(hard) | — |
| MultiPL-E (MBXP) | 75.3 (13 langs) | — |
| CrossCodeEval | 53.7 EM / 85.1 ES | DeepSeek-Coder-33B 48.8 EM |
| RepoEval | 50.8 EM / 75.6 ES | — |
| Needle-in-Code | **100% @ 32K** | — |

## Follow-Up Questions

1. Filter-only(Seed-Coder)와 rewrite-heavy(SwallowCode) 두 *model-centric* 큐레이션을 동일 6T token budget · 동일 evaluation suite (HumanEval+/MBPP+/LiveCodeBench v6/SWE-bench Verified) 하에서 비교하면, *quality-per-FLOP*(1.3B scoring 1회 vs 70B rewrite 1회 per doc) 곡선은 어떤 모양이며, 두 방법은 substitute인가 complement인가?

2. 1.3B Llama 2 quality scorer의 fine-tuning label은 (a) human, (b) larger LLM (GPT-4 등), (c) heuristic rule 중 무엇이 만들었으며, 각 시나리오에서 "model-centric / Bitter Lesson" 슬로건의 정합성과 6T 토큰 전체에 전파되는 systematic bias는 어떻게 진단·통제되는가?

3. Filter ablation 부재라는 결정적 검증 공백을 메우려면 어떤 실험이 필요한가? Random 10% drop · perplexity-only filter · dedup-only baseline과의 동일-budget 비교에서 HumanEval/LiveCodeBench/SWE-bench의 격차가 1pp 이내라면 논문의 핵심 기여는 어떻게 재해석되어야 하는가?

4. GRPO의 87.5% correctness ceiling은 단순 hard-negative mining(advantage signal 보존 trick)인가, 아니면 capability frontier에 trajectory budget을 집중시켜 LongCoT 자연 확장을 유도하는 mechanism인가? 250 step 동안 average trajectory length의 진화 곡선과 ceiling 제거 ablation에서의 32K context utilization 변화로 어떻게 구분 가능한가?

5. 250 RL step + CodeContests/ICPC-only warmup이라는 좁은 reasoning recipe가 OOD reasoning(수학·논리·repo-level debugging·SWE-bench)으로 전이되는지, 그리고 이 전이가 base 모델 6T pretraining에서 이미 형성된 capability의 *unlock*(elicitation)인지 RL이 *추가한* 새 능력인지를 어떻게 분리할 수 있는가?

6. Seed-Coder-Reasoning은 Knowledge2Deck의 mid-training taxonomy(Mid-Training Survey 251008, Front-Loading Reasoning 250926, OctoThinker 250625, Kimi-Dev 250927) 어디에 위치하는가? competitive programming warmup이 일반 SWE-task로 전이되는지(Kimi-Dev "code reasoning ≠ code engineering" 주장의 재확인 여부) — Seed-Coder가 SWE-bench 점수를 보고하지 않는 점이 이 공백의 단서인가?

7. *Bitter Lesson*은 "compute · data scaling이 인간 prior를 이긴다"는 명제인데, Seed-Coder가 인용한 형태(작은 LLM scorer가 hand-crafted rule을 대체)는 (a) Bitter Lesson의 모범 사례인가 (b) 인간 휴리스틱을 더 큰 모델의 휴리스틱으로 옮긴 *sleight-of-hand*인가, 그리고 이 구분이 향후 데이터 큐레이션 R&D 우선순위(curator 자체의 scaling vs 더 나은 rewrite prompt 설계 vs synthesis)에 어떤 함의를 주는가?

## Answers

**1.** Token-equalized 비교는 두 라인이 어디서 substitute이고 어디서 complement인지 분리한다. 가설은 **filter는 head distribution(GitHub 평균 품질) 개선에 강하고, rewrite는 tail rescue(저품질이지만 희소한 도메인 — 예: Lua/Racket/Verilog) 개선에 강하다**. 이는 Seed-Coder가 multi-language MultiPL-E에서 Qwen2.5-Coder-14B 동급에 머무르는 반면 SwallowCode가 Python에 집중해 +17pp HumanEval를 달성한 비대칭과 정합한다. *Quality-per-FLOP* 곡선의 모양: filter는 *concave* (낮은 cost · 빠른 plateau, ~10% 절단 후 추가 절단은 distribution 손상), rewrite는 *linear-then-saturating* (높은 cost · 점진 향상, ~50% rewrite 후 LLM rewriter capacity ceiling). **결정적 실험**: (a) Seed-Coder filter → SwallowCode rewrite 순서의 hybrid를 동일 6T budget으로 학습 — head는 filter로 정리 후 surviving tail만 rewrite하여 비용 ~30% 절감 가능 가설. (b) HumanEval saturation 영역과 LiveCodeBench v6 unsaturated 영역에서의 filter vs rewrite gap 비교 — saturated에서 차이 미미하면 두 방법은 substitute, unsaturated에서 rewrite 우세하면 complement. SwallowCode의 +17pp가 contamination-aware 벤치에서 좁혀지는 정도와 Seed-Coder의 LiveCodeBench 결과 부재가 이 비교의 두 missing data point다.

**2.** 세 시나리오 모두 *Bitter Lesson* 인용과 부분적으로 충돌한다. **(a) Human label 시나리오**: "model-centric" 슬로건이 무너지지만 가장 가능성 낮음 — 1.3B scorer 학습에 필요한 라벨 규모(수만~수십만)를 ByteDance Seed가 인간으로 만들었다면 본문에서 강조했을 것. **(b) Larger LLM (GPT-4 또는 자체 frontier model) 라벨링 시나리오**: 가장 가능성 높음. 이 경우 1.3B scorer는 frontier model의 *quality preference distillation* 형태이며, 6T tokens 전체가 frontier model의 stylistic bias로 systematically 편향된다. *Bitter Lesson*은 "scale 자체"가 아니라 "더 큰 모델의 prior"를 데이터로 매개한 indirect distillation으로 재해석되어야 한다. **(c) Heuristic + weak supervision 시나리오**: pylint score · syntax validity · test coverage 등 휴리스틱으로 weak label을 만들어 1.3B에 압축. 이 경우 hand-crafted rule이 1.3B 모델 가중치 안에 embedded되며 explicit rule보다 maintainability가 *낮을* 수 있다(black-box, 디버그 불가). **진단 protocol**: scorer의 score distribution을 (i) 다양한 라이선스 분포, (ii) 언어별 분포, (iii) 코드 길이 분포 축으로 audit. 특정 축에서 systematic skew가 발견되면 해당 라벨링 source의 fingerprint. ByteDance가 scorer 가중치는 공개했어도 fine-tuning 데이터는 미공개일 가능성이 커, 외부 재현·검증의 가장 큰 공백이 여기에 있다.

**3.** 결정적 ablation은 4-cell 비교다. **Cell 1 — random 10% drop**: 동일 6T 예산에서 무작위 10%만 제거. **Cell 2 — perplexity-only**: base model perplexity 하위 10% 제거. **Cell 3 — dedup-only**: SHA256 + MinHash만 적용 후 추가 필터 없음. **Cell 4 — 1.3B scorer (Seed-Coder)**. **재해석 시나리오**: ① Cell 4 vs Cell 1 격차 < 1pp → 핵심 기여는 사실상 *없음*, 6T scale 자체가 모든 효과를 흡수. *Bitter Lesson*의 진정한 사례지만 논문 thesis는 무너짐. ② Cell 4 vs Cell 2 격차 < 2pp → 1.3B scorer는 비싼 perplexity proxy. 단순 base-model perplexity로 충분. ③ Cell 4 vs Cell 3 격차 5pp 이상 → filter signal 실재, 논문 주장 검증. ④ Cell 4가 모든 baseline에 ~10pp 이상 우세 → "rubric decomposition + bottom-decile 절단"이라는 conservative 설계가 진짜 mechanism, 더 공격적 절단(상위 30% 잔존 OpenCoder류)은 distribution 손상으로 역효과. 추가로 **6T → 2T downscale 실험**이 필요 — filter 효과가 scale-dependent라면(작은 scale에서만 우세) "tokens가 plentiful한 시대에는 filter 가치 점감"이라는 결론이 도출되어 실용적 시사 큼. 논문이 이 4-cell ablation을 보고하지 않는 점은 SwallowCode의 SGCR/SCOR ablation 대비 가장 큰 결함.

**4.** Mechanism 구분의 핵심은 *trajectory length 진화*와 *context utilization*이다. **Hard-negative mining 가설**: ceiling이 단순히 advantage signal이 살아있는 문제만 남기는 optimization trick이라면 trajectory length는 RL 동안 거의 일정해야 하고 32K context는 underutilized. 이 경우 동일 효과를 PPO entropy bonus나 reward shaping으로 달성 가능. **Capability frontier 가설**: ceiling이 자연스럽게 더 어려운 문제로 distribution을 shift시키면 trajectory length는 monotonically 증가하고 32K context utilization도 후반에 늘어남. **결정적 실험**: (a) 250 step 동안 mean/p95 trajectory length 곡선 — monotone 증가면 후자, plateau면 전자. (b) ceiling 제거(=모든 문제 유지) ablation에서 final HumanEval/LiveCodeBench 격차 — 격차가 5pp 이상이면 ceiling이 진짜 mechanism, 1pp 이내면 단순 trick. (c) ceiling을 95%, 75%로 sweeping — 87.5%가 sweet spot이라면 sharp performance peak가 보일 것. 논문이 이 sweep을 보고했는지가 mechanism claim의 강도를 결정. **추가 통찰**: 87.5% threshold(14/16 sample 정답)는 GRPO의 sample 수와 직접 연결된 hyperparameter — 32 sample phase에서는 상응 threshold가 ~93% (28/32)가 되어야 일관 — phase 2에서 threshold 조정이 있었는지 명시되지 않은 점도 검증 필요.

**5.** OOD transfer를 base capability *unlock*과 RL의 *new addition*으로 분리하려면 3축 검증이 필요하다. **축 1 — RL-only ablation**: 250 step RL 적용 vs RL skip 후 동일 CodeContests warmup만 SFT한 모델 비교. SFT-only가 SWE-bench의 70% 이상 도달하면 RL은 marginal하며 capability는 base에서 옴. **축 2 — Cross-domain probe**: GSM8K, MATH, MMLU-STEM 등 코드 외 reasoning 벤치에서의 변화. 코드 RL이 일반 reasoning으로 transfer되면 RL이 *general reasoning prior*를 강화한 것이고, 코드에만 머무르면 narrow distribution overfit. **축 3 — Capability ladder probe**: easy→hard 난이도별 pass@k 곡선의 shift. RL이 base 분포의 mode만 sharpen하면 (mode collapse) 평균 pass@1은 올라도 pass@k는 감소(DeepSeek-R1 논문이 보고한 패턴). RL이 새 capability를 추가하면 pass@k도 증가. **Kimi-Dev 시사점**: agentless skill prior 논문은 "competitive programming warmup으로 학습된 모델은 SWE-bench의 multi-file edit·tool-use 분포에서 약화된다"고 주장. Seed-Coder가 SWE-bench Verified를 보고하지 않는 점은 이 약점을 인지했을 가능성. **결론적 검증**: ByteDance가 Seed-Coder-Reasoning을 SWE-bench Verified, MATH-500, MMLU-STEM에서 평가한 후 base 대비 격차를 공개해야 RL의 가치 분리 가능 — 250 step만으로는 *base capability elicitation*이 지배적이라는 가설이 더 강하다.

**6.** Mid-Training taxonomy에서 Seed-Coder-Reasoning은 **post-training 영역의 RL-with-mid-training-warmup** 좌표에 위치 — 정확히는 *base → SFT(instruct) → CodeContests/ICPC warmup(=mid-training-like 분포 적응) → GRPO RL*. **Front-Loading Reasoning(250926)**의 권장(reasoning trace 5~15% mid-training inclusion)과 비교하면 Seed-Coder는 mid-training 단계에 reasoning trace를 명시적으로 주입하지 않았고, 대신 post-training 직전 warmup에 좁은 distribution(competitive programming)으로 압축. **OctoThinker(250625)**의 "mid-training scaffolds RL"과 정합하지만, scaffold 분포가 narrow한 점이 차이. **Kimi-Dev(250927)**의 agentless skill prior는 SWE-bench를 직접 타깃해 multi-file edit/tool-use 분포로 mid-training하는데, Seed-Coder는 이 단계가 없어 SWE-bench transfer 약점 예상. **단서 — SWE-bench 부재**: Seed-Coder가 LiveCodeBench는 강조하면서 SWE-bench Verified를 보고하지 않는 패턴은 (a) 평가하지 않았거나 (b) 평가했으나 약해 미공개. Kimi-Dev의 thesis ("code reasoning은 algorithmic puzzle 해결, code engineering은 repo navigation + minimal edit — 두 분포는 다른 mid-training 필요")가 Seed-Coder의 boundary로 재확인된다. **통합 가설**: 8B 규모 frontier code 모델은 *Seed-Coder식 broad pretraining filter + SwallowCode식 selective rewrite + Kimi-Dev식 SWE-task warmup + Seed-Coder식 GRPO*의 4-stage pipeline이 single-best 라인. 어느 한 가지를 빼면 코드 능력의 sub-distribution(algorithmic, framework, repo-engineering)에서 약점이 누락된다.

**7.** 인용 형태는 *sleight-of-hand*에 가깝다. **Bitter Lesson의 정확한 명제**: "general methods leveraging *computation* (search, learning) win over methods leveraging *human knowledge*". Seed-Coder가 hand-crafted regex를 1.3B scorer로 대체한 것은 *human-prior → model-prior* 이전이지 *prior-based → compute-based*가 아니다 — Sutton의 원 명제 기준 이는 진화가 아닌 평행 이동. **진정한 Bitter Lesson 형태**: filter도 rewrite도 없이 6T 그대로 학습하되 모델 크기와 토큰을 모두 키워 quality 신호를 model 내부 attention pattern이 emergent하게 발견하도록 하는 것. Q3의 ablation Cell 1(random drop)이 Cell 4와 같다면 이 진정한 Bitter Lesson 가설을 지지. **Sleight-of-hand 진단**: Seed-Coder의 1.3B scorer가 더 큰 LLM(GPT-4 또는 frontier ByteDance model)으로 라벨링되었다면, 이는 인간 휴리스틱을 *frontier model의 휴리스틱*으로 옮긴 것 — Bitter Lesson의 본질에 반함(인간이 직접 코딩한 rule은 작은 모델 가중치보다 *더* compute-friendly하기 때문). **R&D 우선순위 재배열**: ① **curator 자체의 scaling**(1.3B → 70B → 405B scorer)이 logarithmic gain만 주면 *small curator + good rubric*이 정답 — Seed-Coder가 옳음. ② **더 나은 rewrite prompt 설계**(Nemotron-CC의 5종 prompt → 50종)가 sub-linear gain만 주면 prompt 다양성보다 rewrite quality(Llama-3.3-70B → DeepSeek-V3 등 capacity 강화)가 효율적. ③ **Phi-1식 synthesis**는 small/specialized 영역에서만 가치 — frontier scale에서는 distribution coverage 손실이 합성 품질 이득을 상쇄. 종합: Seed-Coder의 *small filter + large pretraining*은 단기적으로는 가장 cost-efficient 베팅이지만, 장기적으로는 **filter signal을 모델 학습 동안 implicit하게 학습하는 self-curriculum** 방향(예: training-time data weighting · TLM · DataInf 류)이 진정한 *Bitter Lesson*에 부합. Seed-Coder는 이 transition의 중간 단계로 기록될 가능성이 크다.

---

**arXiv:** 2506.03524v2 · **Submission:** 2025-06-04 · **Latest revision:** 2025-06-05
**Affiliation:** ByteDance Seed
**Released:** Open-source models (base / instruct / reasoning), 8.2B parameters

**Knowledge2Deck 인접 노트:**
`2025/250505 Rewriting Pre-Training Data Boosts LLM Performance in Math and Code.md` (filter+rewrite 직접 paired comparison 대상) · `2025/250530 Nemotron-CC.md` (web rewrite vs code filter 도메인 차이) · `2025/250820 Nemotron-CC-Math.md` · `2025/250625 OctoThinker Mid-training Incentivizes Reinforcement Learning Scaling.md` (mid-training scaffolds RL 좌표) · `2025/250926 Front-Loading Reasoning.md` (reasoning trace 5~15% inclusion 권장) · `2025/250927 Kimi-Dev Agentless Training as Skill Prior for SWE-Agents.md` (code reasoning ≠ code engineering 주장의 검증 단서) · `2025/251008 Mid-Training of Large Language Models A Survey.md` (taxonomy 위치 비교) · Phi-1 *Textbooks Are All You Need* (closed synthesis 라인의 대조군)
