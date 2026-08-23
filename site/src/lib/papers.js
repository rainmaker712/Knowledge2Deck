/**
 * knowledge2deck/ 논문 MD 파서.
 * 포맷 계약 (docs/ARCHITECTURE.md):
 *   1행: [제목](URL)
 *   3행: 저자 목록
 *   5행~: > 블록쿼트 초록
 * 포맷 이탈 파일은 경고 후 스킵한다 (빌드 실패 금지).
 */
import fs from 'node:fs';
import path from 'node:path';

/** 사이트에 노출할 콘텐츠 디렉토리 (TBD, next-plan 등 작업용은 제외) */
export const CONTENT_DIRS = ['2023', '2024', '2025', '2026', 'tech-report'];

/**
 * 파일명 `YYMMDD Title.md` → { dateAdded, title, isSlides } 또는 null.
 */
export function parseFilename(filename) {
  const m = filename.match(/^(\d{2})(\d{2})(\d{2}) (.+)\.md$/);
  if (!m) return null;
  const [, yy, mm, dd, rest] = m;
  const isSlides = / slides$/i.test(rest);
  return {
    dateAdded: `20${yy}-${mm}-${dd}`,
    title: isSlides ? rest.replace(/ slides$/i, '') : rest,
    isSlides,
  };
}

/**
 * MD 본문 → { title, url, authors, abstract } 또는 null (포맷 이탈).
 */
export function parsePaperFile(content) {
  const lines = content.split('\n');
  // 1행: [제목](URL)
  const first = lines.find((l) => l.trim() !== '') ?? '';
  const titleMatch = first.match(/^\[(.+?)\]\((\S+?)\)\s*$/);
  if (!titleMatch) return null;
  const [, title, url] = titleMatch;

  const titleIdx = lines.indexOf(first);
  // 제목 다음 첫 비어있지 않은 non-blockquote 행 = 저자
  let authors = '';
  for (let i = titleIdx + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '') continue;
    if (t.startsWith('>')) break;
    authors = t;
    break;
  }
  // > 블록쿼트 행 전체 = 초록
  const abstract = lines
    .filter((l) => l.trimStart().startsWith('>'))
    .map((l) => l.trimStart().replace(/^>\s?/, ''))
    .join(' ')
    .trim();

  return { title, url, authors, abstract };
}

/** URL-safe slug */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * knowledge2deck/ 루트에서 논문 전체 로드.
 * @returns {Array<{slug, title, url, authors, abstract, dateAdded, category, file, hasSlides, slidesFile}>}
 */
export function loadPapers(contentRoot) {
  const papers = [];
  const usedSlugs = new Map(); // slug → 사용 횟수 (KO 버전 등 동일 제목 충돌 방지)
  for (const dir of CONTENT_DIRS) {
    const dirPath = path.join(contentRoot, dir);
    if (!fs.existsSync(dirPath)) continue;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name);
    // 슬라이드 목록 (파일명 제목은 논문 파일명 제목의 단축형일 수 있음)
    const slides = mdFiles
      .map((f) => ({ name: f, meta: parseFilename(f) }))
      .filter((s) => s.meta?.isSlides);
    for (const name of mdFiles) {
      const meta = parseFilename(name);
      if (!meta) {
        console.warn(`[papers] 파일명 규칙 이탈, 스킵: ${dir}/${name}`);
        continue;
      }
      if (meta.isSlides) continue;
      const raw = fs.readFileSync(path.join(dirPath, name), 'utf-8');
      const parsed = parsePaperFile(raw);
      if (!parsed) {
        console.warn(`[papers] MD 포맷 이탈, 스킵: ${dir}/${name}`);
        continue;
      }
      let slug = `${meta.dateAdded.replaceAll('-', '').slice(2)}-${slugify(parsed.title)}`;
      const count = usedSlugs.get(slug) ?? 0;
      usedSlugs.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count + 1}`;
      // 슬라이드 페어링: 같은 날짜 + 논문 파일명 제목이 슬라이드 제목으로 시작 (단축형 허용)
      const paired = slides.find(
        (s) => s.meta.dateAdded === meta.dateAdded && meta.title.startsWith(s.meta.title),
      );
      papers.push({
        ...parsed,
        // 파일명 제목이 본문 제목의 단축형인 경우가 있어 본문 제목을 우선
        dateAdded: meta.dateAdded,
        category: dir,
        file: `${dir}/${name}`,
        slug,
        hasSlides: Boolean(paired),
        slidesFile: paired ? `${dir}/${paired.name}` : null,
      });
    }
  }
  // 추가일 역순
  papers.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded) || a.title.localeCompare(b.title));
  return papers;
}
