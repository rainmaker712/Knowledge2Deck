# Architecture Decision Records

## 철학
리포의 마크다운이 단일 진실 원천. 서버·DB 없이 정적으로 최대한 간다.
외부 의존성 최소화, 작동하는 최소 구현 우선.

---

### ADR-001: 리포 자체를 CMS로 사용 (파일 기반 콘텐츠)
**결정**: 별도 CMS/DB 없이 `knowledge2deck/*.md`를 콘텐츠 소스로 쓴다.
**이유**: 이미 수백 편의 논문이 일관된 MD 포맷으로 존재. git이 버전 관리·백업·리뷰를 다 제공. paper-ingest 파이프라인이 이 포맷으로 산출.
**트레이드오프**: 웹 어드민 없음(편집은 git 경유), 포맷 이탈 파일에 대한 파서 방어 코드 필요.

### ADR-002: Astro 정적 사이트 + GitHub Pages (Next.js에서 변경, 2026-08-22)
**결정**: Astro로 완전 정적 빌드, GitHub Actions → GitHub Pages 배포. Tailwind CSS v4 사용.
**이유**: (1) 기존 논문 MD가 frontmatter 없는 커스텀 포맷 — Jekyll/Hugo는 변환 필요, Astro는 커스텀 파서로 파일 무수정 처리 가능. (2) 기본 출력 zero-JS — 정적 아카이브에 최적. (3) TS/Tailwind 스택 유지, 검색 등 인터랙션만 클라이언트 스크립트.
**트레이드오프**: Next.js 대비 웹앱 확장성 낮음 (필요 시 island로 React 부분 도입 가능). Jekyll 대비 Actions 배포 설정 직접 필요 (~10줄).
**대체 검토**: Jekyll — GitHub Pages 내장이지만 커스텀 MD 포맷과 궁합 나쁨, Ruby 로컬 환경 부담. Next.js — 블로그/아카이브 용도로 과함.

### ADR-003: 검색은 빌드 타임 인덱스 + 클라이언트 사이드
**결정**: 빌드 시 논문 메타데이터를 JSON 인덱스로 생성, 브라우저에서 검색.
**이유**: 서버 없는 제약 하에서 유일한 선택지. 논문 수천 편 규모까지는 단일 JSON으로 충분.
**트레이드오프**: 초록 전문 포함 시 인덱스 크기 증가 — 필요 시 제목·저자만 인덱싱하고 초록은 상세 페이지로.

### ADR-004: PDF·대용량 파일은 사이트 비포함
**결정**: 사이트는 MD 메타데이터만 서빙, PDF는 arXiv 원본 링크로 연결.
**이유**: 리포 내 PDF는 개인 보관용. Pages 용량·빌드 시간 절약, 저작권 리스크 회피.
**트레이드오프**: arXiv 외 출처 논문은 원본 URL 의존.

### ADR-005: 슬라이드는 Marp 마크다운으로 작성
**결정**: 발표 슬라이드(`YYMMDD Title slides.md`)는 Marp 포맷(frontmatter `marp: true`)으로 통일. 사이트 빌드 시 `@marp-team/marp-cli`로 HTML 렌더링해 논문 상세 페이지에서 연결 (Phase 3).
**이유**: 슬라이드도 마크다운 = git 버전 관리 + 리포-as-CMS 철학 유지. 기존 슬라이드 파일이 이미 Marp 포맷. marp-cli HTML 출력은 브라우저 의존성 없이 빌드 가능.
**트레이드오프**: Kimi Slides 등 외부 도구 산출물(PDF/PPTX)은 사이트 비노출. 디자인 자유도는 PPT 대비 제한.
