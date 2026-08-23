# UI 디자인 가이드

## 디자인 원칙
1. 도구처럼 보여야 한다 — 마케팅 페이지가 아니라 매일 쓰는 논문 아카이브 대시보드
2. 텍스트가 주인공 — 제목·저자·초록의 가독성이 모든 장식보다 우선
3. 밀도 있게 — 한 화면에 많은 논문이 보이도록. 여백 과잉·히어로 섹션 금지

## AI 슬롭 안티패턴 — 하지 마라
| 금지 사항 | 이유 |
|-----------|------|
| backdrop-filter: blur() | glass morphism은 AI 템플릿의 가장 흔한 징후 |
| gradient-text (배경 그라데이션 텍스트) | AI가 만든 SaaS 랜딩의 1번 특징 |
| "Powered by AI" 배지 | 기능이 아니라 장식. 사용자에게 가치 없음 |
| box-shadow 글로우 애니메이션 | 네온 글로우 = AI 슬롭 |
| 보라/인디고 브랜드 색상 | "AI = 보라색" 클리셰 |
| 모든 카드에 동일한 rounded-2xl | 균일한 둥근 모서리는 템플릿 느낌 |
| 배경 gradient orb (blur-3xl 원형) | 모든 AI 랜딩 페이지에 있는 장식 |

## 색상
### 배경
| 용도 | 값 |
|------|------|
| 페이지 | #0a0a0a |
| 카드/행 hover | #141414 |

### 텍스트
| 용도 | 값 |
|------|------|
| 주 텍스트 (논문 제목) | text-white |
| 본문 (초록) | text-neutral-300 |
| 보조 (저자, 날짜) | text-neutral-400 |
| 비활성 | text-neutral-500 |

### 데이터/시맨틱 색상
| 용도 | 값 |
|------|------|
| 포인트 (링크, 활성 필터) | #34d399 (emerald-400) |
| 에러/경고 | #ef4444 |
| 중립/테두리 | neutral-800 |

## 컴포넌트
### 논문 행/카드
```
rounded-md border border-neutral-800 p-4 hover:bg-[#141414]
```

### 버튼
```
Primary: rounded-md bg-white text-black hover:bg-neutral-200
Text:    text-neutral-500 hover:text-neutral-300
```

### 검색 입력
```
rounded-md bg-neutral-900 border border-neutral-800 px-4 py-2.5
focus: border-neutral-600 (링·글로우 없음)
```

## 레이아웃
- 전체 너비: max-w-4xl (읽기 중심)
- 정렬: 좌측 정렬 기본. 중앙 정렬 금지
- 간격: 목록 항목 gap-2, 섹션 간 space-y-8
- 목록 기본 뷰: 연도별 그룹 + 추가일 역순

## 타이포그래피
| 용도 | 스타일 |
|------|--------|
| 페이지 제목 | text-2xl font-semibold text-white |
| 논문 제목 (목록) | text-base font-medium text-white |
| 초록 본문 | text-sm text-neutral-300 leading-relaxed |
| 저자·날짜 메타 | text-xs text-neutral-400 |

## 애니메이션
- 허용: 페이지 fade-in (0.2s), hover 배경 전환 (transition-colors 0.15s)
- 그 외 모든 애니메이션 금지 (스크롤 트리거, 스태거, 카운트업 등)

## 아이콘
- SVG 인라인, strokeWidth 1.5, 16~20px
- 아이콘 컨테이너(둥근 배경 박스)로 감싸지 않는다
- 외부 링크(arXiv)에만 최소한으로 사용
