[Loop Engineering: The Anthropic Playbook for Designing Systems That Prompt Your Agents](https://drive.google.com/file/d/1qzKI4DKnyHRpXK1J3ATPqwaqLc0iNu-M/view)

HuaShu (independent synthesis), building on Addy Osmani (Google Chrome), Peter Steinberger (OpenClaw), Boris Cherny (Anthropic), Prithvi Rajasekaran (Anthropic), Steve Kaliski (Stripe)

> Over the past two years a string of "XX Engineering" terms has tracked the pace of model releases. This note examines the newest of them, Loop Engineering, a term independently surfaced in June 2026 by Peter Steinberger, Boris Cherny, and Addy Osmani, and named in writing by Osmani. Unlike prompt, context, or harness engineering, loop engineering does not teach the practitioner to do the work better; it removes the practitioner from the position of doing the work at all. We define the term, place it as a fourth layer above the harness, and decompose a single turn of a loop into five moves—discovery, handoff, verification, persistence, and scheduling—and the six parts that realize them. We give particular attention to the generator/evaluator separation: empirically, an agent asked to grade its own output tends to praise it, and tuning an independent skeptical evaluator is far more tractable than making a generator critical of its own work. We survey three loops running in practice, from one engineer's morning triage to Stripe's enterprise-scale pipeline merging over 1,300 machine-written pull requests per week, and we catalog four costs that accrue silently—verification debt, comprehension rot, cognitive surrender, and token blowout. We close with a concrete recipe for building a first loop. The central claim is that loops make generation nearly free and leave judgment as the scarce resource; the same loop, built by two people, can yield opposite outcomes.

<!-- Panel Verdict: PROCEED -->
<!-- Metaphor: self-running bakery -->

## 비유로 풀어보기

이 글은 arXiv 논문이 아니라 Addy Osmani의 오픈 가이드(*Loop Engineering: Stop Asking Me What It Is*, Orange Books v260615)를 conference-style로 재구성한 working note다. 실험·벤치마크 대신 현장에서 돌아가는 loop 3개를 사례로 분석한 essay라는 점을 먼저 밝혀둔다.

비유는 하나로 간다 — **타이머로 밤새 혼자 빵을 굽는 무인 제빵기(self-running bakery)**. 당신은 더 이상 반죽을 치대지 않는다. 빵 굽는 기계를 *설계하는* 사람이 된다.

### 풀려는 문제 (Problem)

지난 2년간 빵집의 일하는 방식을 부르는 이름이 모델 릴리스 속도에 맞춰 계속 바뀌었다. 처음엔 **prompt engineering** — "반죽에 뭐라고 말을 거느냐", 좋은 레시피 카드 한 장 쓰는 법. 다음은 **context engineering** — "지금 작업대 위에 어떤 재료를 올려두느냐", 밀가루·이스트·물을 그릇에 정확히 담는 법. 그 다음은 **harness engineering** — "한 번의 빵을 굽는 데 필요한 도구를 갖추는 법", 오븐 온도·타이머·꺼내는 타이밍을 한 판(one run)에 맞게 무장시키는 일.

**Loop engineering은 그 위 네 번째 층이다.** 앞의 세 층은 전부 "작업대 앞에 사람이 앉아 빵을 굽는다"를 전제했다. Loop engineering은 그 전제를 지운다. 핵심 차이가 바로 여기다 — 다른 "XX engineering"은 *더 잘 굽는 법*을 가르치지만, loop engineering은 *사람을 작업대에서 빼낸다*. 이제 사람은 빵을 굽는 자가 아니라, 빵을 알아서 굽는 기계를 *바깥에서 설계하는* 자다.

이 용어는 2026년 6월 한 주 만에 세 사람(Peter Steinberger, Boris Cherny, Addy Osmani)에게서 거의 동시에 튀어나왔다. Steinberger의 글은 800만(8 million) 조회를 찍었고, Osmani가 6월 7일 블로그에 "loop engineering"이라고 이름 붙여 적었다. 동시다발은 우연이 아니다 — 도구들이 임계선을 넘었기 때문이다: 코딩 에이전트가 비-사소한 작업을 사람 없이 끝낼 만큼 믿을 만해졌고, 스케줄링 primitive가 주요 harness에 등장했고, 한 번의 에이전트 실행 비용이 *반복해서 돌려도 아깝지 않을 만큼* 떨어졌다. 재료가 다 갖춰지자, 타이머를 거는 일이 당연해졌다.

문제는 이 기계가 잘 도는 게 아니다. **기계가 "안 돼"라고 말할 줄 모른다는 것**이다. 빵을 굽는 손이 곧 그 빵을 평가하는 손이면, 자기가 구운 빵을 늘 맛있다고 한다. 그 손이 밤새 혼자 돌면, 잘못 구운 빵이 *기계 속도로* 쌓인다.

### 어떻게 푸는가 (Method)

제빵기가 한 판을 돌리는 한 번의 turn은 다섯 동작(five moves)으로 쪼개진다. 하나라도 빠지면 기계는 돌지 않거나, 제자리에서 헛돈다.

1. **Discovery(발견)** — 오늘 무슨 빵을 구울지 *스스로* 정한다. 재고 센서가 "식빵이 떨어졌다"를 읽어내는 일. 사람이 주문서를 건네는 게 아니라, 어제 실패한 CI·열린 이슈·최근 커밋을 기계가 직접 훑어 "할 일"을 찾는다. 핵심: 이 발견 로직은 cron에 박아둔 명령어 뭉치가 아니라 **skill(`SKILL.md`)** 로 만들어 재사용·유지보수가 되게 한다.
2. **Handoff(넘김)** — 구울 빵마다 *따로 빵틀*을 준다. 여러 빵을 한 틀에서 구우면 반죽이 서로 들러붙는다. git **worktree** 하나씩 떼어주면, 여러 에이전트가 같은 파일을 동시에 고쳐도 충돌하지 않는다. "돌긴 하지만 엉망"이 "돌고 깔끔"으로 바뀐다.
3. **Verification(검증)** — *별도의* 시식 담당이 "이 빵 탔어"라고 말한다. 가장 잘라먹기 쉽지만 가장 잘라선 안 되는 동작. 굽는 손과 맛보는 손은 **반드시 달라야** 한다. 이게 이 글의 심장이다 (아래 별도 단락).
4. **Persistence(보존)** — 오늘 무슨 빵을 몇 개 구웠는지 *주문 장부*에 적는다. 결과가 context window에만 살면, 창이 비워지는 순간 기계는 어제를 통째로 잊는다. 장부는 PR·이슈 트래커·디스크의 state 파일(markdown)에 남아야 한다. "에이전트는 잊어도 repo는 잊지 않는다."
5. **Scheduling(스케줄링)** — *타이머*가 매일 새벽 기계를 켠다. 이게 없으면 그저 "사람이 손으로 한 번 돌리고 마는 판"이지 loop가 아니다. "automation이야말로 loop를 진짜 loop로 만든다."

이 다섯 동작을 떠받치는 여섯 부품(six parts): **Automations**(타이머), **Worktrees**(빵틀), **Skills**(재사용 레시피 — 매번 "이 빵집이 뭐고 규칙이 뭔지" 설명하는 *intent debt*를 갚아준다), **Connectors**(MCP로 바깥 세상 — Slack·이슈트래커·DB에 연결), **Sub-agents**(굽는 자와 심판을 분리), **Memory**(디스크에 남는 장부).

**생성자/평가자 분리 (Generator / Evaluator) — 이 글의 핵심.** 빵을 구운 제빵사에게 "맛있냐"고 물으면 대개 맛있다고 한다. 자기 손으로 만든 것의 *맛없을 이유가 아니라 맛있게 만든 이유*를 보기 때문이다. Anthropic의 Prithvi Rajasekaran이 장기 실행 에이전트를 만들며 관찰한 게 이거다: standalone generator를 스스로에게 비판적이게 *튜닝하는 것*보다, 전혀 다른 지시를 받은 **회의적인 별도 평가자(skeptical evaluator)를 갈아끼우는 것**이 훨씬 다루기 쉽다. GAN에서 빌려온 발상 — 한 망은 만들고(generator), 다른 망은 흠을 잡는다(evaluator). 그래서 검증 담당에게는 이렇게 시킨다: **"이 빵은 탔다고 가정하라. 타지 않았음이 증명되기 전까지는(ASSUME the code is BROKEN until proven otherwise)."** 게다가 시식만으로는 부족하다 — 평가자는 *행동해야* 한다. 프론트엔드라면 Playwright MCP로 직접 페이지를 열고 버튼을 눌러보고 스크린샷을 찍어 "돌아가 보이느냐"가 아니라 "정말 돌아가느냐"를 판정한다. Claude Code는 이 구조를 `/goal` primitive로 만든다 — 조건을 주고 충족될 때까지 돌리되, *매 turn마다 갓 띄운 fresh small model이* 조건 충족을 판정한다. 만든 자가 아니라 새 심판이 완료를 선언한다(maker–checker 원칙). 이는 `/loop`(단순히 일정 간격으로 같은 일을 재실행)와 혼동하면 안 된다.

R4(Critical) 관점에서 반드시 짚을 지점: 이 글은 실험 논문이 아니라 essay이고, 인용된 수치 일부는 저자도 *2차 요약치라 거칠게 봐야 한다*고 경고한다 — 예컨대 "Claude Code의 약 90%(~90%)가 스스로 작성된다" 같은 자주 회자되는 수치는 firsthand가 아니다. 사례 3개(1인 triage, Stripe Minions)는 일화이지 통제 실험이 아니다.

### 무엇을 얻었나 (Result)

현장에서 *밤새 혼자 도는* 빵집 사례들:

- **한 엔지니어의 아침 triage.** Osmani가 만든 작은 loop. 새벽 자동으로 켜져 어제 실패한 CI·열린 이슈·최근 커밋을 skill로 읽고(Discovery), 손볼 가치가 있는 항목마다 격리된 worktree를 열어(Handoff) 한 에이전트가 고치면 다른 에이전트가 검토하고(Verification), connector가 PR을 열고 티켓을 갱신하고(Persistence), state 파일이 남아 다음 날 이어받는다(Scheduling). 한 사람·한 기계 규모의 가장 작은 loop.
- **Stripe의 Minions — 엔터프라이즈 규모.** 한 주에 **1,300개가 넘는(over 1,300)** machine-written PR을 머지한다. 트리거는 가볍다 — Slack의 @봇 호출이나 이모지 반응. 신뢰성의 비결은 *모델이 깨어나기 전*에 있다: deterministic orchestrator가 먼저 링크를 스캔하고 Jira를 끌어오고 Sourcegraph + MCP로 관련 코드를 모은다(LLM이 아니라). deterministic gate(파란 단계)와 LLM 단계(초록 단계)가 맞물린다 — 에이전트가 코드를 쓰면, 하드코딩된 linter gate는 에이전트가 건너뛸 수 없고, 에이전트가 lint를 고치면, 하드코딩된 단계가 commit한다. 핵심 반전: **신뢰성은 모델 크기가 아니라 제약(constraint)의 질에서 온다.** Minions는 더 센 모델이 아니라 open-source Goose의 fork이고, EC2에서 "cattle not pets"로 돌아 천 개 넘는 에이전트가 서로 안 밟고 동시에 달린다. 그래도 1,300개 PR은 여전히 사람이 검토한다 — 사람이 떠난 게 아니라, 쓰는 자리에서 검토하는 자리로 *옮겼을* 뿐.

스케줄링 선택지 비교: 로컬 `/loop`(최소 간격 1분, 로컬 파일 접근 가능, 머신 켜져 있어야 함) vs 클라우드 routine(최소 간격 1시간, 깨끗한 clone, 머신 꺼져 있어도 됨). 로컬은 *빈도*를 사고 클라우드는 *진짜 자율성*을 산다. 성숙한 loop는 둘 다 쓴다 — 촘촘한 inner check는 로컬로, 밤샘 sweep은 클라우드로.

그리고 조용히 쌓이는 네 가지 비용(four silent costs) — 청구서 어디에도 경보로 뜨지 않는다:

1. **Verification debt(검증 부채).** 머지된 PR마다 시간을 아끼지만, 아낀 시간은 *검증 안 된 산출물*로 미뤄진다. 테스트가 못 덮는 틈에서 자라다 어느 출근길 아침에 터진다.
2. **Comprehension rot(이해 부패).** loop가 빨리 찍어낼수록, "존재하는 코드"와 "내가 실제로 이해하는 코드" 사이 간극이 벌어진다. 빵집이 뭘 굽는지 더는 모른다.
3. **Cognitive surrender(인지적 항복).** "시간 없어"가 아니라 "더는 의견 갖기 싫어"로 바뀌는 태도. 판단을 외주 준다.
4. **Token blowout(토큰 폭발).** 청구서를 직접 때리는 유일한 비용. 버그 하나가 밤새 헛돌며 무관한 빵을 무더기로 굽는다. 가드는 *출시 전에* 박는 하드캡 — per-run budget, daily budget, max retries.

**worked example:** 밤새 PR 20개(twenty)를 다 green test로 열었다. 표면상 승리. 그런데 그중 3개(three)에 테스트가 못 잡는 미묘한 오류가 있다 → verification debt. 사람이 20개 변경을 안 읽고 머지했으니 머릿속 코드 지도가 20개만큼 뒤처진다 → comprehension rot. loop가 매끄럽게 돌아 사람이 다음 날 아침 batch를 통째로 안 본다 → cognitive surrender. 밤새 재시도하느라 예상의 3배 청구서 → token blowout. 네 비용은 독립된 위험이 아니라 *한 실패가 쓴 네 개의 얼굴*이고 서로를 강화한다(Fig. 6의 reinforcing cycle).

다섯 anti-pattern은 다섯 동작을 하나씩 건너뛴 결과다: **Nodding loop**(verification 생략 — 자기 빵 자기가 칭찬, 가장 흔한 실패), **Amnesiac loop**(persistence 생략 — 매일 아침 같은 자리에서 다시 시작), **Tangled loop**(handoff 생략 — 한 작업대에 여러 반죽이 엉김), **Blind loop**(discovery 생략 — 사람이 여전히 매일 메뉴를 정함), **Manual loop**(scheduling 생략 — 사람이 손으로 돌리다 잊음).

첫 loop 만드는 레시피: `/loop`(v2.1.72 이후 사용 가능, 세션 스코프, recurring task는 7일 후 만료) → discovery skill → state 파일 → `/goal`(v2.1.139 이후, 별도 모델이 stop 조건 판정) → `--worktree`로 병렬 격리. 6요소 체크리스트의 앞 둘은 "loop가 돌 수 있는가", 뒤 넷은 "돌다가 사고 칠 때 멈출 수 있는가"를 결정한다. 새벽 06:00 cron으로 doing은 자동화하되, never-auto-merge + `./inbox/`로 사람의 문이 열려 있게 둔다.

### 비유가 깨지는 지점 (Limit)

빵집 비유는 직관을 주지만, 바로 그 직관이 *이 글이 가장 무섭다고 말하는 지점*을 가린다.

- **탄 빵은 보이지만, 나쁜 코드는 안 보인다.** 제빵기 비유의 가장 큰 거짓말이다. 빵이 타면 냄새와 색으로 즉시 안다 — 검증이 쉽다. 그런데 글의 핵심 경고는 정반대다: loop의 잘못된 산출물은 *green test 뒤에 숨어* 보이지 않는다. 20개 중 3개의 미묘한 오류는 탄내가 나지 않는다. 비유가 "검증은 시식하면 되는 쉬운 일"처럼 느끼게 만드는 순간, 이 글의 verification debt 논지를 정확히 거꾸로 전달한다. (그래서 평가자는 *읽지 말고 실행*해야 한다 — Playwright로 실제로 눌러봐야 "탄내 없는 탄 빵"을 잡는다.)
- **제빵기는 빵맛의 상한을 정하지만, loop는 사람의 판단을 무한 증폭한다.** 이게 글의 진짜 결론이고 비유로는 안 잡힌다 — *같은 loop를 두 사람이 지으면 정반대 결과*가 나온다. 한 사람은 이미 통달한 일을 더 빨리 하려고 쓰고(코드를 읽고 방향 감각이 또렷하니 loop가 그 판단을 100배로 키운다), 다른 사람은 영영 이해 안 해도 되려고 쓴다(6개월 뒤 읽지 못하는 기계의 문지기가 된다). loop는 도구가 아니라 **충실한 곱셈 기호** — 가져오는 것이 이해력이든 게으름이든 그대로 곱한다. 똑같은 제빵기 두 대가 빵맛을 똑같이 내는 것과는 전혀 다르다.
- **판단은 희소 자원이 되지만, 빵 굽기엔 그런 경제가 없다.** generation이 거의 공짜가 되면(코드·계획·PR·수정), 희소해지는 건 *어느 안을 고를지의 판단*이다. loop는 "그럴듯한(looks reasonable)" 백 가지를 만들 수 있어도 "맞는(actually right)" 하나를 못 고른다. 엔지니어의 가치가 기계적 노동(빠른 타이핑·API 암기)에 있었다면 증발하고, 판단에 있었다면 증폭된다. 빵 비유엔 "어느 빵이 옳은가"라는 환원 불가능한 판단 노동이 없다.
- **장르.** 통제 실험·ablation이 없는 essay다. "1,300 PRs/week", "20개 중 3개", "~90% 자가작성"은 일화·2차 요약치이며, 일반화 가능한 정량 주장이 아니다. arXiv 논문이 아니라 오픈 가이드의 재구성이라는 점도 인용 시 유의.

> Cross-link: harness 층을 다룬 [[260518 Code as Agent Harness]]의 한 칸 위가 이 글의 loop 층이다. self-improving 루프의 weight update까지 가는 [[260526 SIA Self Improving AI with Harness and Weight Updates]], discovery 자동화를 다룬 [[260512 LLMs Improving LLMs Agentic Discovery for Test-Time Scaling]]와 함께 읽으면 "에이전트가 스스로 도는 시스템" 계열로 묶인다.
