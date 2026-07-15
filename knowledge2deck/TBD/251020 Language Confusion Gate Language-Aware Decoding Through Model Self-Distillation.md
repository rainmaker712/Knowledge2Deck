[Language Confusion Gate: Language-Aware Decoding Through Model Self-Distillation](https://arxiv.org/abs/2510.17555)

Collin Zhang, Fei Huang, Chenhan Yuan, Junyang Lin

> Large language models (LLMs) often experience language confusion, which is the unintended mixing of languages during text generation. Current solutions to this problem either necessitate model retraining or cannot differentiate between harmful confusion and acceptable code-switching. This paper introduces the Language Confusion Gate (LCG), a lightweight, plug-in solution that filters tokens during decoding without altering the base LLM. The LCG is trained using norm-adjusted self-distillation to predict appropriate language families and apply masking only when needed. Our method is based on the findings that language confusion is infrequent, correct-language tokens are usually among the top predictions, and output token embedding norms are larger for high-resource languages, which biases sampling. When evaluated across various models, including Qwen3, GPT-OSS, Gemma3, Llama3.1, LCG decreases language confusion significantly, often by an order of magnitude, without negatively impacting task performance.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: 다국어 회의실 발언권 사회자 -->

## 비유로 풀어보기

여러 언어가 섞인 국제 회의실을 떠올려 보자. 발표자는 한국어로 발표하다가 가끔 엉뚱하게 중국어 단어 하나를 툭 내뱉는다. language confusion이란, 바로 이렇게 회의 도중 의도치 않게 다른 언어가 끼어드는 현상이다.

### 풀려는 문제 (Problem)

문제는 발표자가 그 단어의 올바른 언어 표현을 *모르는 게 아니라는* 점이다. 올바른 언어의 단어는 거의 항상 혀끝에 맴돌고 있다 — language consistent tokens가 top-3 안에 들어 있는 경우가 99.29%다. 즉 정답은 손만 뻗으면 닿는 자리에 있는데, 회의실에서 자꾸 엉뚱한 사람이 마이크를 채간다.

왜 채갈까? 어떤 단어들은 *목소리가 본질적으로 더 크기* 때문이다. 이 회의실에서 high-resource language에 속한 단어(participants)는 output token embedding norm이 더 크고, 이 큰 norm이 sampling 단계에서 그 단어 쪽으로 확률 질량을 쏠리게 만든다. 실제로 Qwen3-8B에서 가장 norm이 큰 상위 5% token 중 10.74%가 CJ(Chinese/Japanese) token이다 — 어휘 비중에 비해 과대 대표되어 있는, 목소리 큰 단골 참석자들이다. 최신 모델조차 이 잡음에서 자유롭지 못해, GPT-5-Chat도 CJ character confusion 0.57%, Latin-script confusion 0.67%를 보인다.

### 어떻게 푸는가 (Method)

LCG는 회의실 자체(base LLM)는 손대지 않고, 입구에 **사회자(gate)** 한 명을 새로 앉히는 plug-in 방식이다. 사회자는 two-layer MLP에 불과하다.

먼저 마이크에 **음량 정규화기**를 단다. 단어를 "얼마나 크게 말했나"가 아니라 "무슨 내용을 말했나"로만 판정하도록, logit을 embedding norm으로 나눈다:

logit_adj,i = h·e_i / ||e_i|| = ||h||·cos_sim(h, e_i)

이렇게 하면 norm 크기(목소리 크기)가 사라지고, token은 오직 hidden state와의 cosine similarity(내용 적합도)로만 순위가 매겨진다.

다음으로 사회자는 매 발언 턴마다 *어떤 언어 그룹에게 발언권을 줄지*를 정한다. 참석자는 네 family로 나뉜다 — CJ, Latin, Symbols, Low-Res(low-resource languages) — Unicode 기반 heuristic으로 분류된다. 사회자는 부적절한 family의 token을 logit에서 masking한다.

핵심은 사회자가 **꼭 필요할 때만** 개입한다는 점이다. Symbols와 Low-Res token은 절대 막지 않고, 직전 비-symbol token의 언어 family는 항상 허용해 문장의 linguistic coherence를 지키며, 모델이 높은 확신으로 내놓은 출력과 충돌하지 않을 때만 마스킹한다. 그래서 정당한 code-switching까지 입을 막아버리는 과잉 통제(R4가 우려하는 지점)를 구조적으로 피한다.

사회자를 가르치는 방법이 norm-adjusted self-distillation이다. 외부 정답지를 가져오는 게 아니라, *회의실 자신의 음량 정규화된 선호*를 교본으로 삼는다. debiased top-k/top-p 후보 집합에서 각 family의 token이 하나라도 등장하면 그 family의 pseudo-target을 1로 두고, 네 family 예측 각각에 binary cross-entropy를 독립적으로 적용한다. base model의 weight는 전혀 건드리지 않는다.

### 무엇을 얻었나 (Result)

엉뚱한 언어의 끼어듦이 대체로 **한 자릿수 배(order of magnitude)** 줄었고, 회의의 실제 산출물 품질은 그대로 유지됐다.

FLORES-NO-LATIN 기준(Table 3):
- Qwen3-8B: Latin% 12.1% → 2.0%, CJ% 4.5% → 0.1%, BLEU 12.1 → 12.1
- Qwen3-30B: Latin% 4.4% → 0.4%, CJ% 1.0% → 0.0%, BLEU 13.2 → 13.4
- Llama3.1-8B: Latin% 8.4% → 2.9%, CJ% 3.0% → 0.4%, BLEU 11.3 → 12.3

INCLUDE benchmark에서는 Qwen3-30B의 CJ confusion이 2.21% → 0.11%로 떨어지면서 정확도는 안정적으로 유지됐다.

Thinking model에서도(Table 4, Humaneval-XL Arabic/Hebrew): GPT-OSS는 CJ 0.38% → 0.06%에 pass@1 59.88% → 60.19%, Qwen3-30B는 CJ 0.12% → 0.00%에 pass@1 80.56% → 79.44%.

정당한 code-switching은 죽이지 않았다(Table 5): Qwen3-8B의 code-switch rate는 46.34% → 25.90%로 줄되, confusion point의 86.7%에서는 여전히 English token을 허용했고, 남은 비율은 Claude Sonnet 4(23.29%)보다 높게 유지됐다.

대안 대비 우위도 분명하다(Figure 3, Qwen3-8B): in-context learning은 CJ% 4.5% → 4.2%, greedy decoding도 4.2%에 그쳐 사실상 무력했다. ORPO fine-tuning은 일부 모델에선 견줄 만했으나 task 성능을 깎아먹었다(INCLUDE accuracy 61.4% → 57.3%). 음량 정규화기 자체의 효과를 보는 ablation에서도 LCG-adjusted가 LCG-unadjusted를 일관되게 앞섰다(Llama3.1-8B Latin confusion 5.7% → 2.9%).

### 비유가 깨지는 지점 (Limit)

사회자는 참석자를 *script 단위*로만 구분한다. 즉 그가 가진 명단은 "한자권 / 라틴문자권 / 기호 / 저자원" 네 칸뿐이다. 그래서 같은 라틴 script를 쓰는 Spanish와 English가 섞이는 confusion이나, 두 low-resource language 사이의 혼동은 사회자가 애초에 구별할 수단이 없다 — 회의실 비유로는 "같은 알파벳을 쓰는 두 나라 사람"을 사회자가 한 무리로 뭉뚱그려 버리는 셈이다. 저자들도 이 script-level granularity를 한계로 명시하며, 더 세밀한 token classification scheme이 필요한 language-specific gate를 future work로 남긴다.

또한 비유가 가리는 실제 약점도 있다. (1) thinking model에서는 발언권 통제가 추론 흐름을 미세하게 건드려 Qwen3-30B pass@1이 80.56% → 79.44%로 소폭 하락했다 — "품질에 악영향 없음"이라는 요약이 모든 셀에서 성립하는 것은 아니다. (2) 음량 정규화기와 사회자 모두 base model이 *이미 올바른 token을 top 후보에 올려둔다*는 전제(top-3 99.29%) 위에서만 작동한다. 모델이 정답 언어를 후보 자체에 거의 올리지 않는 극단적 저자원 상황에서는, 막을 수는 있어도 올바른 token을 끌어올려 주지는 못한다 — 사회자는 발언권을 *분배*할 뿐, 없는 발언자를 *만들어내지는* 못한다.
