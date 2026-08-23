import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePaperFile, parseFilename, slugify, loadPapers } from './papers.js';

// ---- parseFilename ----

test('parseFilename: 날짜와 제목 분리', () => {
  const r = parseFilename('260404 GrandCode Achieving Grandmaster Level.md');
  assert.equal(r.dateAdded, '2026-04-04');
  assert.equal(r.title, 'GrandCode Achieving Grandmaster Level');
});

test('parseFilename: 날짜 prefix 없으면 null', () => {
  assert.equal(parseFilename('no-date-file.md'), null);
});

test('parseFilename: slides 파일 식별', () => {
  const r = parseFilename('260404 GrandCode slides.md');
  assert.equal(r.isSlides, true);
});

// ---- parsePaperFile (표준 포맷: 제목링크 / 저자 / 초록 블록쿼트) ----

const STANDARD = `[Deduplicating Training Data Makes Language Models Better](https://arxiv.org/abs/2107.06499)

Katherine Lee, Daphne Ippolito, Andrew Nystrom

> We find that existing language modeling datasets contain many near-duplicate examples.
> Deduplication allows us to train models that reach the same accuracy faster.
`;

test('parsePaperFile: 표준 포맷 파싱', () => {
  const p = parsePaperFile(STANDARD);
  assert.equal(p.title, 'Deduplicating Training Data Makes Language Models Better');
  assert.equal(p.url, 'https://arxiv.org/abs/2107.06499');
  assert.equal(p.authors, 'Katherine Lee, Daphne Ippolito, Andrew Nystrom');
  assert.match(p.abstract, /near-duplicate examples/);
  assert.match(p.abstract, /accuracy faster/);
});

test('parsePaperFile: 제목 링크 없으면 null (포맷 이탈)', () => {
  assert.equal(parsePaperFile('# 그냥 헤딩\n\n본문'), null);
});

test('parsePaperFile: 초록 없는 파일도 파싱 (abstract 빈 문자열)', () => {
  const p = parsePaperFile('[Title Only](https://arxiv.org/abs/1234.5678)\n');
  assert.equal(p.title, 'Title Only');
  assert.equal(p.abstract, '');
  assert.equal(p.authors, '');
});

// ---- slugify ----

test('slugify: 공백·특수문자 처리', () => {
  assert.equal(slugify('Mamba & SSM: A Survey'), 'mamba-ssm-a-survey');
});

// ---- 슬라이드 페어링 (fixture 디렉토리) ----

import fs from 'node:fs';
import os from 'node:os';

test('loadPapers: 단축형 슬라이드 파일명 페어링', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'k2d-'));
  const dir = path.join(root, '2026');
  fs.mkdirSync(dir);
  const paperMd = '[GrandCode Achieving Grandmaster Level](https://arxiv.org/abs/2604.00001)\n\nA, B\n\n> abs\n';
  fs.writeFileSync(path.join(dir, '260404 GrandCode Achieving Grandmaster Level.md'), paperMd);
  fs.writeFileSync(path.join(dir, '260404 GrandCode slides.md'), '---\nmarp: true\n---\n# S\n');
  fs.writeFileSync(
    path.join(dir, '260405 Other Paper.md'),
    '[Other Paper](https://arxiv.org/abs/2604.00002)\n\nC\n\n> abs2\n',
  );
  const papers = loadPapers(root);
  const grand = papers.find((p) => p.title.startsWith('GrandCode'));
  const other = papers.find((p) => p.title === 'Other Paper');
  assert.equal(grand.hasSlides, true);
  assert.equal(grand.slidesFile, '2026/260404 GrandCode slides.md');
  assert.equal(other.hasSlides, false);
  fs.rmSync(root, { recursive: true, force: true });
});

// ---- loadPapers (실제 콘텐츠 디렉토리 통합 테스트) ----

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.resolve(__dirname, '../../../knowledge2deck');

test('loadPapers: 실제 리포에서 논문 로드', () => {
  const papers = loadPapers(CONTENT_ROOT);
  assert.ok(papers.length > 50, `논문이 50편 이상이어야 함 (실제: ${papers.length})`);
  // 모든 논문에 필수 필드 존재
  for (const p of papers) {
    assert.ok(p.slug, `slug 없음: ${p.file}`);
    assert.ok(p.title, `title 없음: ${p.file}`);
    assert.ok(p.dateAdded, `dateAdded 없음: ${p.file}`);
    assert.ok(p.category, `category 없음: ${p.file}`);
  }
  // slug 유일성
  const slugs = new Set(papers.map((p) => p.slug));
  assert.equal(slugs.size, papers.length, 'slug 중복 존재');
  // slides 파일은 논문 목록에 포함되지 않음
  assert.ok(!papers.some((p) => / slides$/i.test(p.title)), 'slides 파일이 목록에 섞임');
});
