[Rewriting Pre-Training Data Boosts LLM Performance in Math and Code](https://arxiv.org/abs/2505.02881)

[Slides](https://docs.google.com/presentation/d/1qDEgBGfCOemhNTbc6AlyWpLMn8IdBlNu_VGzlfsQjQA/edit?usp=sharing)

Kazuki Fujii, Yukito Tajima, Sakae Mizuki, Masaki Kawamura, Hinari Shimada, Taihei Shiotani, Koshiro Saito, Masanari Oi, Taishi Nakamura, Takumi Okamoto, Shigeki Ishida, Kakeru Hattori, Youmi Ma, Hiroya Takamura, Rio Yokota, Jun Sakuma, Naoaki Okazaki

> The-Stack-v2의 **영어/공용 Python 코드**를 4-step pipeline(syntax → pylint ≥ 7.0 → SGCR → SCOR)으로 16.1B token까지 rewrite하여 Llama-3.1-8B 50B continual PT에서 HumanEval **+17.0pp**, GSM8K **+12.4pp**(SwallowMath)를 달성. "필터링 = 버리기"가 아닌 "rewrite = 고쳐쓰기"로 정보 보존하며 분포만 학습 친화적으로 옮긴다는 transform-and-retain 패러다임의 정량 근거를 제시한 Tokyo Tech/AIST의 첫 완전 공개 (Llama 3.3 Community License, dataset/prompt/checkpoint/pipeline code 모두 공개) pre-training 코드 rewrite 레시피.

<!-- Panel Verdict: PROCEED (Conditional 보완 반영) -->

## Key Contributions

- **Transform-and-Retain 패러다임 (R1 Novelty)**: filter-only(Stack-Edu/FineWeb-Edu)가 nutrient-poor data를 _버리는_ 접근이라면, SwallowCode는 LLM rewriter로 raw GitHub Python 코드를 in-place로 정제·재작성하여 정보 보존 + 분포 학습 친화적 이동을 동시에 달성. Phi-1의 closed-model textbook 합성과 Nemotron-CC의 5종 web prompt rewrite의 중간 지점 — 공개 데이터(The-Stack-v2) + open rewriter(Llama-3.3-70B) 기반으로 재현성 확보.

- **SGCR이 단일 최대 gain (+7~9pp HumanEval) (R2 Technical)**: Llama-3.3-70B-Instruct가 Google Python Style Guide 10 criteria(descriptive variable naming, type annotation via `typing`, modular function decomposition, docstring 보강, exception handling, PEP-8 등)를 강제. 핵심 설계는 **filter-then-rewrite 순서** — pylint ≥ 7.0 통과 snippet에만 적용해 rewriter가 "문법 복원"이 아닌 "스타일/구조 상승"에 집중하게 만든다. descriptive identifier + type annotation이 next-token prediction에서 semantic anchor로 기능하는 효과로 추정되며, ablation에서 단순 reformatting이라면 +1~2pp에 그쳐야 정상이라는 점에서 +7pp는 surface-level 정규화로 설명 불가.

- **SCOR가 +5~6pp 추가 (SGCR 위 누적) (R2 Technical)**: 외부 import inline화(self-containment), naive loop → vectorized/`itertools` 패턴, trivial sample(`print("hello")` 류) 의미화의 3가지 변환을 동시 수행. ablation에서 SGCR(+7~9pp)과 직교적 효과가 입증되어 "스타일 정규화 → 의미 보강"이 두 단계 분리 최적화 가능한 설계 공간임을 제시. **단점**: rewriter 출력은 별도 pylint/test 검증 없이 corpus에 적재되므로, 잘못된 알고리즘 최적화(off-by-one, edge case 누락)가 plausible-but-wrong 패턴으로 internalize될 silent failure 위험은 미검증.

- **Cross-model 일반화 입증 (Qwen2-7B 20B token HumanEval +10.3pp) (R3 Impact)**: Llama tokenizer/pretrain 분포에 fit한 우연이 아닌 base-agnostic methodology임을 부분 검증. 데이터셋이 commodity화되어 OpenCoder/Qwen2.5-Coder/DeepSeek-Coder의 코드 단계 데이터를 plug-in 컴포넌트로 대체 가능. open release(datasets, prompts, checkpoints, pipeline code) + Llama 3.3 Community License는 enterprise 채택 시 The-Stack-v2 upstream 라이선스(개별 repo SPDX) 호환성을 별도 검증해야 한다는 부담은 남는다.

- **검증 공백과 비용 — 5T+ frontier 재현·distillation·라이선스 (R4 Critical)**: ① **Distillation confound 미분리** — 70B rewriter가 자기 capacity의 알고리즘 지식을 16B token 형태로 student에 _data-mediated distillation_ 했을 가능성. capacity-matched(8B-Instruct rewriter) + cross-family(Qwen2.5-72B/DeepSeek-V3) ablation 부재. ② **벤치마크 saturation** — HumanEval/MBPP는 frontier 모델이 90%+ 도달한 ceiling 영역이라 +17pp 중 일부는 pass@1 variance collapse 거품일 수 있음. **LiveCodeBench v6 / SWE-bench Verified / BigCodeBench-Hard 평가 부재**가 가장 큰 외부 타당도 공백. ③ **Scale gap** — 50B는 frontier(5T+)의 ~1%로, filter-only baseline이 더 긴 horizon에서 수렴할 가능성 미배제. ④ **운영 비용** — 16B output token을 70B로 rewrite하는 inference 비용은 수만~수십만 GPU-hour로 작은 팀의 self-replication에는 과도하며, GPL/AGPL 등 copyleft 코드가 rewrite 후 라이선스 오염 여부도 회색지대.

## Method (요약)

| Step | 이름 | 방법 | 손실/효과 |
|---|---|---|---|
| 1 | Syntax filter | Python 3.10 `compile()` 파싱 실패 제거 | 9.7% 손실 |
| 2 | Linter filter | pylint score ≥ 7.0 | 추가 34.3% 제거 / +1pp |
| 3 | **SGCR** | Llama-3.3-70B-Instruct로 Google Python Style Guide 10-criteria rewrite | **+7~9pp** (단일 최대) |
| 4 | **SCOR** | self-contained 화 + 알고리즘 최적화 + trivial sample 의미화 | +5~6pp (SGCR 위 누적) |
| 누적 | | 41B → **16.1B** Python tokens | HumanEval **+17.0**, HumanEval+ **+16.1** |

**SwallowMath** (2.3B tokens, Finemath-4+ 기반): web header/metadata 제거 → irrelevant info 삭제 → 누락 context 복원 → 간결한 derivation → step-by-step solution. Llama-3.1-8B 50B PT에서 GSM8K **+12.4**, MATH **+7.6**.

**Continual pretraining 구성**: Llama-3.1-8B base, ~50B tokens 총 예산. Mixture는 ~82~84% multilingual text + 13~16% code + 4.79% math. 10B token마다 checkpoint 평가.

**Cross-model 일반화**: Qwen2-7B + 20B token continual PT에서 HumanEval / HumanEval+ 모두 +10.3pp.

## Follow-Up Questions

1. SGCR의 +7~9pp 향상은 (i) style normalization을 통한 token-distribution 정제, (ii) Llama-3.3-70B rewriter의 implicit knowledge distillation, (iii) descriptive naming/type annotation이 만든 "self-documenting code"의 semantic anchor 효과 중 어느 메커니즘이 지배적인가, 세 효과는 분리 가능한가?

2. SCOR의 algorithmic optimization rewrite가 잘못된 최적화(off-by-one, edge case 누락)를 corpus에 누적시킬 때, 단순 noise averaging으로 사라지는가 아니면 plausible-but-wrong 패턴으로 internalize되어 long-context coding의 silent failure mode가 되는가?

3. SwallowCode의 +17pp가 contamination이 아닌 진짜 reasoning 향상이라면 LiveCodeBench v6 / BigCodeBench-Hard / SWE-bench Verified 같은 contamination-resistant·multi-file 벤치마크에서도 같은 폭의 향상이 재현될 것인가, 아니면 HumanEval/MBPP saturation에 기댄 효과인가?

4. "데이터 품질 향상"과 "70B → 8B distillation" 기여도를 분리하려면 어떤 ablation이 필요한가? Capacity-matched(8B-Instruct) rewriter, cross-family(Qwen2.5-72B/DeepSeek-V3) rewriter, logit-distillation baseline과의 비교가 어떤 결정적 증거를 줄 수 있는가?

5. Llama-3.3-70B rewriter의 stylistic·algorithmic 편향이 학생 모델에 caste system처럼 전이되는가? Llama family 약점(long-context attention sink, 특정 idiomatic 코드 선호)을 그대로 상속할 위험을 어떻게 진단할 수 있는가?

6. SwallowCode의 transform-and-retain은 Nemotron-CC의 5종 rewrite prompt나 Phi-1의 GPT-4 rating + GPT-3.5 textbook 합성과 데이터 분포·비용·라이선스·재현성 4축에서 어떤 trade-off를 가지며, 세 라인을 통합하면 어떤 단일 파이프라인이 가능한가?

7. SwallowCode를 mid-training annealing의 reasoning-trace mix(Front-Loading 권장 5~15%) 또는 post-training SFT(OCR-2)와 어떤 순서·비율로 배치해야 시너지가 극대화되며, 5T+ frontier scale에서 16B rewrite corpus의 비율은 어떻게 조정되어야 하는가?

## Answers

**1.** 세 메커니즘은 원리적으로 분리 가능하지만 실험 설계상 거의 항상 공변(co-vary)한다. **(i) Style normalization**은 surface-level token distribution을 좁혀 perplexity 학습 신호의 noise를 줄이고, **(ii) implicit distillation**은 70B rewriter가 자신의 "이해된 코드"를 출력하면서 high-level abstraction을 corpus에 주입하며, **(iii) self-documenting effect**는 descriptive identifier가 next-token prediction에서 semantic prior 역할을 한다. SGCR(+7~9pp)이 SCOR(+5~6pp)보다 큰 ablation 비대칭은 (iii)이 지배적임을 시사한다 — 단순 reformatting이라면 +1~2pp에 그쳐야 정상이며, +7pp는 rewriter가 변수명·docstring을 통해 "프로그램 의도(intent)"를 explicit signal로 변환했음을 의미. 논문 본문에는 명시되지 않으나, (i)와 (iii)을 분리하려면 AST-preserving rename-only ablation(같은 70B로 identifier만 교체)이 결정적이며 +5pp 이상이면 (iii) 확정. (ii)의 분리는 capacity-matched rewriter ablation이 필요(Q4 참조).

**2.** 단순 averaging으로 소거되지 않고 plausible-but-wrong 패턴으로 internalize될 가능성이 높다. 핵심은 SCOR의 rewrite가 **style-consistent**하다는 점 — 잘못된 최적화도 깔끔한 type annotation, 명확한 변수명, modular 구조로 포장되어 corpus 분포의 high-likelihood region을 차지한다. 이는 random web noise(낮은 likelihood로 자연 분리됨)와 달리 학습 시 강한 gradient signal을 받는다. HumanEval/MBPP는 짧은 단일 함수라 silent failure가 드러나지 않지만, multi-step reasoning이나 large input edge case에서는 "그럴듯하게 잘못된" 코드를 자신감 있게 생성하는 mode collapse가 예상된다. Phi-1이 textbook synthesis 후 OOD 일반화에서 보인 brittleness 패턴과 유사한 위험이며, SCOR-rewritten 코드의 hypothesis-기반 fuzz 검증이 빠진 채 16B token이 그대로 들어간 점은 구조적 약점. LiveCodeBench의 hidden test 평가에서 +17pp가 좁혀지면 이 가설이 지지된다.

**3.** 부분적 contamination + 진짜 향상의 혼합일 가능성이 높다. Llama-3.3-70B는 학습 시 GitHub + HumanEval-style canonical solution을 광범위하게 본 모델이며, SGCR rewrite 과정에서 rewriter가 무의식적으로 canonical pattern을 corpus에 주입한 risk가 있다(=rewriter-mediated contamination). 다만 +17pp 전체가 contamination이라면 cross-model Qwen2-7B(+10.3pp)에서 같은 패턴이 나오지 않아야 하는데 그렇지 않으므로, 최소 +5~7pp는 진짜 코드 품질 효과로 보는 것이 타당하다. 결정적 검증은 (a) LiveCodeBench v6의 cutoff-after-rewriter 문항에서의 격차, (b) BigCodeBench-Hard의 library-call diversity 문항, (c) SWE-bench Verified의 multi-file edit success — 세 지표 모두에서 +5pp 이상 유지되어야 reasoning 향상으로 인정 가능. 논문이 LCB/SWE-bench 평가를 누락한 점은 가장 큰 검증 공백이며, OpenCoder가 동일 contamination 문제를 decontamination pipeline으로 해결하려 한 접근 대비 SwallowCode는 한 단계 부족.

**4.** 결정적 ablation은 3축 cross-product 설계가 필요하다. **첫째, Capacity-matched rewriter**: Llama-3.3-8B-Instruct(타겟 동급)로 rewrite한 corpus와 70B rewrite corpus를 동일 50B 예산으로 비교 — 격차가 +5pp 이상이면 distillation 효과 실재. **둘째, Cross-family rewriter**: Qwen2.5-72B 또는 DeepSeek-V3로 rewrite한 corpus로 Llama-3.1-8B를 학습 — 같은 capacity에서 family가 다른 상황에서 격차가 사라진다면 stylistic alignment(family-internal distillation)가 핵심임이 확정. **셋째, Logit-distillation baseline**: 동일 16B raw 코드에 대해 70B의 next-token logit을 KD loss로 8B에 직접 전달한 결과와 비교 — KD가 SGCR보다 우월하면 "텍스트 매개 distillation"의 효율이 낮은 것이고, 열등하면 rewrite가 distillation의 우월한 형태(soft label보다 hard data가 효과적)임이 입증. 이 세 ablation 없이는 "데이터 품질"과 "distillation"의 기여 비율을 분리할 수 없으며, 논문이 단일 70B rewriter family만 사용한 것은 외부 타당도(external validity) 측면 가장 심각한 한계.

**5.** 전이는 이미 발생하고 있으며 두 채널로 진단 가능. **Channel A (stylistic 편향)**: Llama family는 list comprehension·f-string·type hint를 선호하고 metaclass·decorator-heavy 패턴을 회피하는 경향. SGCR rewrite로 16B 코드 corpus 전체에 평균화되면, 학생 모델은 Pythonic이지만 framework-heavy 코드(SQLAlchemy, Django ORM, Pydantic v2)에서 미묘한 약점을 보일 가능성 — token-level KL divergence로 진단 가능. **Channel B (algorithmic 편향)**: SCOR가 "복잡도 최적화"를 강제할 때 70B rewriter의 알고리즘 선호(예: dict 기반 lookup 우선, recursion 회피)가 corpus에 박히고, Llama family의 long-context attention sink 약점이 long function을 짧게 분해하는 경향으로 corpus에 누적되면 학생 모델도 같은 약점 학습. 진단: Qwen2.5-72B-rewritten corpus로 학습한 동일 학생 모델과 task-mix별 win-rate 비교 — task-conditional gap 패턴이 family-specific하면 caste system 가설 지지.

**6.** 4축 trade-off는 다음과 같다. **(i) 데이터 분포**: Nemotron-CC는 5종 prompt(QA·summary·extraction·list·encyclopedia)로 web 다축 cover하여 generalist에 유리, Phi-1은 textbook synthesis로 좁고 깊은 분포(specialist), SwallowCode는 코드 도메인의 transform-and-retain으로 raw GitHub 분포 보존 + 품질 향상의 중간 지점. **(ii) 비용**: Phi-1(GPT-4 rating + GPT-3.5 synthesis)이 가장 비싸고 폐쇄적, Nemotron-CC도 NVIDIA 내부 모델 의존, SwallowCode는 Llama-3.3-70B(open-weight)로 16B token rewrite를 ~수만~수십만 GPU-hour로 마쳐 가장 재현 친화적. **(iii) 라이선스**: Phi-1은 GPT 합성물로 OpenAI ToS 회색지대, Nemotron-CC도 closed model 의존, SwallowCode는 Llama 3.3 Community License로 명시적 공개 — Knowledge2Deck 기준 최우수(단 The-Stack-v2의 upstream individual repo SPDX 호환성은 enterprise 별도 검증 필요). **(iv) 재현성**: SwallowCode가 prompt+pipeline+checkpoint 모두 공개해 명확한 우위. **통합 파이프라인 가능성**: raw web/code → Nemotron-style 다축 prompt로 1차 rewrite(다양성 확보) → SwallowCode-style style+algorithmic 2단 rewrite(품질 정제) → Phi-1-style synthetic textbook을 reasoning-dense supplement로 5~10% 추가. 이 3-tier 구조가 generalist 분포·도메인 품질·specialist reasoning을 동시 충족.

**7.** 50B continual PT는 frontier scale의 ~1% 수준이라 high-LR·wide-distribution 환경이며, SwallowCode는 이 단계에 적합(style-normalized 16B는 다양한 패턴 학습에 도움). 그러나 mid-training annealing에서는 분포 압축이 일어나므로 SwallowCode 전체를 넣으면 redundancy 발생 — Front-Loading 권장대로 5~15% reasoning trace(chain-of-thought 풀이 + algorithmic walkthrough)와 SCOR-only(SGCR 제외) 5~10%의 조합이 적절하다. SCOR의 self-contained·optimization-rewritten 코드는 reasoning trace와 syntactic 호환성이 높아 mid-training의 "compact reasoning prior"에 직접 기여. SFT 단계(OCR-2)에서는 SwallowCode 자체보다는 SwallowCode로 학습한 모델이 생성한 instruction-following 코드를 사용하는 것이 distribution shift를 줄인다. **Frontier scale (5T+)**: 16B는 0.3% 비중에 불과해 단독 효과가 희석된다 → 두 옵션: (a) SGCR pipeline을 raw GitHub 전체(~수백 B)에 확장 적용하여 5~10% 비중 유지, (b) 16B를 high-LR 초반 phase에 집중 배치(curriculum)하여 효과 보존. 가장 현실적인 미래 검증 과제는 작은 예산에서 강한 효과가 큰 예산에서 감쇠하는 패턴(Phi 시리즈가 frontier scale로 가면 우위 축소)이 SwallowCode에서도 반복되는지 — 5T 환경 +17pp 유지 여부는 미해결.

---

**arXiv:** 2505.02881v4 · **Submission:** 2025-05-05 · **Latest revision:** 2026-03-01
**Affiliations:** Institute of Science Tokyo (CS Dept · Integrated Research, Supercomputing Research Center) · National Institute of Advanced Industrial Science and Technology (AIST)
**License:** Llama 3.3 Community License (datasets/prompts/checkpoints/pipeline code 공개)

**Knowledge2Deck 인접 노트:**
`research/data/code/code_guide_syn.md` (SwallowCode 표준 reference로 §3-1 인용) · `2025/250530 Nemotron-CC.md` (5종 rewrite prompt 비교) · `2025/250820 Nemotron-CC-Math.md` (수학 코드 전이) · `tech-report/Qwen2.5-Coder` (3-stage curriculum) · `tech-report/OpenCoder` (open recipe) · `2025/250926 Front-Loading Reasoning.md` (mid-training inclusion) · `2025/[Phi-1 Textbooks Are All You Need]`
