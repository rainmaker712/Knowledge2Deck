# 아키텍처

## 리포 구조 (모노리포: 콘텐츠 + 사이트)
```
knowledge2deck/        # 콘텐츠 소스 (단일 진실 원천)
├── 2023~2026/         # 연도별 논문 MD (+PDF, 슬라이드 MD)
├── tech-report/       # 기술 리포트
├── TBD/               # 분류 대기 (사이트 비노출)
└── next-plan/         # 리서치 계획 (사이트 비노출)
scripts/               # 파이프라인 (execute.py)
docs/                  # PRD, ARCHITECTURE, ADR, UI_GUIDE
site/                  # Astro 정적 사이트
├── src/pages/         # 페이지 (index, papers/[slug])
├── src/components/    # UI 컴포넌트
├── src/layouts/       # 공통 레이아웃
├── src/lib/           # MD 파서 (papers.js) + 테스트
└── src/styles/        # Tailwind 전역 스타일
.github/workflows/     # (Phase 3) 빌드·배포 Actions
```

## 콘텐츠 포맷 (파서 계약)
```
[논문 제목](https://arxiv.org/abs/XXXX.XXXXX)   ← 1행: 제목 + 링크

저자1, 저자2, ...                                ← 3행: 저자

> 초록 전문 (verbatim)                           ← 5행~: 블록쿼트
```
- 파일명 `YYMMDD Title.md`에서 추가일·제목 파생
- 같은 이름의 `* slides.md`가 있으면 슬라이드로 연결 — 슬라이드는 **Marp 포맷** (`marp: true`)
- 파서는 포맷 이탈 파일을 빌드 실패가 아닌 경고+스킵으로 처리

## 데이터 흐름
```
논문 추가 (paper-ingest) → knowledge2deck/*.md → git push
→ GitHub Actions (.github/workflows/deploy.yml): 테스트 → 빌드
   ├ prebuild: scripts/build-slides.mjs — marp-cli로 slides.md → public/slides/<slug>.html (+참조 에셋 복사)
   └ astro build: MD 전체 파싱 → 정적 페이지 (BASE_PATH=/리포명)
→ GitHub Pages 배포 (최초 1회 Settings → Pages → Source = "GitHub Actions")
```
런타임 서버 없음. 모든 데이터는 빌드 타임에 확정된다.

## 패턴
- Astro 정적 페이지 기본 (zero-JS), 검색·필터만 최소 클라이언트 스크립트
- MD 파싱은 `site/src/lib/papers.js` 한 곳에 격리 — 페이지는 파싱 결과만 소비
- 파서는 프레임워크 무의존 순수 함수 → `node --test`로 테스트

## 상태 관리
- 서버 상태 없음 (정적). 클라이언트 상태는 검색어 정도 — 바닐라 JS로 충분
