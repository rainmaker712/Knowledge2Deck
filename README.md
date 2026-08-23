# Knowledge2Deck

AI 리서치 페이퍼 아카이브. 논문을 마크다운(+PDF, 슬라이드)으로 수집·정리하고,
이 리포를 콘텐츠 소스로 삼는 정적 사이트를 GitHub Pages로 배포한다(예정).

## 구조

```
knowledge2deck/     # 논문 콘텐츠 — 연도별(2023~2026), tech-report, TBD
docs/               # PRD, ARCHITECTURE, ADR, UI_GUIDE
scripts/            # 파이프라인 스크립트
site/               # Astro 정적 사이트
```

## 콘텐츠 규칙

- 파일명: `YYMMDD Title.md` (YYMMDD = 컬렉션 추가일)
- 포맷: 제목 링크 → 저자 → 초록 블록쿼트 (상세: docs/ARCHITECTURE.md)
- 슬라이드: `YYMMDD Title slides.md`, Marp 포맷 (`marp: true`)

## 로드맵

1. **Phase 1** (완료) — 콘텐츠 리포 정비
2. **Phase 2** (완료) — `site/` 스캐폴딩: MD 파서 + 목록/상세 페이지 (Astro)
3. **Phase 3** (완료) — 검색(초록 포함)·필터 + Marp 슬라이드 HTML 렌더링 + GitHub Actions 배포
4. **Phase 4** — 태그, 논문 간 연관 링크, RSS

## 배포

main push 시 `.github/workflows/deploy.yml`이 테스트 → 빌드(슬라이드 포함) → GitHub Pages 배포.
최초 1회 리포 **Settings → Pages → Source를 "GitHub Actions"로** 설정해야 한다.

상세 계획은 [docs/PRD.md](docs/PRD.md) 참고.
