# 프로젝트: Knowledge2Deck

AI 리서치 페이퍼 아카이브. 논문을 마크다운(+PDF, 슬라이드)으로 수집·정리하고,
향후 이 리포를 콘텐츠 소스로 삼는 GitHub 연동 정적 사이트를 제작한다.

## 리포 구성
```
knowledge2deck/     # 논문 콘텐츠 (단일 진실 원천, 사이트의 CMS 역할)
├── 2023~2026/      # 연도별 논문 (2026년 논문은 루트에 두다가 연말에 이동)
├── TBD/            # 분류 대기
├── tech-report/    # 모델 릴리즈 등 기술 리포트
└── next-plan/      # 리서치 계획 문서
docs/               # PRD, ARCHITECTURE, ADR, UI_GUIDE
scripts/            # 파이프라인 스크립트 (execute.py)
site/               # Astro 정적 사이트 (Phase 2)
```

## 콘텐츠 규칙
- CRITICAL: 논문 파일명은 `YYMMDD Title.md` — YYMMDD는 **컬렉션 추가일** (논문 발행일 아님)
- CRITICAL: MD 포맷 고정 — 1행: `[제목](arXiv URL)`, 3행: 저자 목록, 5행~: `>` 블록쿼트 초록 전문
- 슬라이드는 `YYMMDD Title slides.md`, **Marp 포맷** (frontmatter `marp: true`) 으로 작성
- 논문 추가는 `paper-ingest` 스킬 사용, 슬라이드는 `paper-slides` 스킬 사용
- 기존 논문 MD의 내용(초록·저자)은 수정하지 않는다 — 원문 그대로 유지

## 사이트 기술 스택
- Astro (완전 정적 빌드), TypeScript strict mode, Tailwind CSS v4
- DB·서버 없음 — 빌드 타임에 `knowledge2deck/*.md` 파싱 → 정적 페이지 생성
- 배포: GitHub Actions → GitHub Pages (main push 시 자동)

## 아키텍처 규칙 (사이트)
- CRITICAL: 콘텐츠는 `knowledge2deck/` MD 파일만이 소스 — 사이트 코드에 논문 데이터를 하드코딩하지 말 것
- CRITICAL: 런타임 서버 의존 금지 (API 라우트·DB·인증 없음) — 전부 빌드 타임 처리
- MD 파싱 로직은 `site/src/lib/`에 격리, 컴포넌트는 `site/src/components/`에 분리
- 파서는 포맷 이탈 파일을 빌드 실패가 아닌 경고+스킵으로 처리

## 개발 프로세스
- 새 기능 구현 시 테스트 먼저 작성 (TDD) — 특히 MD 파서는 실제 논문 파일 픽스처로 검증
- 커밋 메시지는 conventional commits (feat:, fix:, docs:, refactor:, chore:)

## 명령어
```
python3 scripts/execute.py <phase-dir>   # 하네스 스텝 실행
cd site && npm run dev                   # 사이트 개발 서버
cd site && npm run build                 # 정적 빌드 (dist/)
cd site && npm test                      # MD 파서 테스트 (node --test)
```
