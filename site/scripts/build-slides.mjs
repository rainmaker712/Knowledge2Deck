#!/usr/bin/env node
/**
 * Marp 슬라이드 빌드 (ADR-005).
 * 논문과 페어링된 Marp 슬라이드(`YYMMDD Title slides.md`)를 HTML로 렌더링해
 * public/slides/<paper-slug>.html 로 출력한다.
 * Astro 빌드 시 public/ 이 dist/ 로 복사되어 정적 서빙된다.
 *
 * Usage: node scripts/build-slides.mjs  (npm run build 의 prebuild 로 자동 실행)
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPapers } from '../src/lib/papers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.resolve(SITE_ROOT, '../knowledge2deck');
const OUT_DIR = path.join(SITE_ROOT, 'public/slides');

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const withSlides = loadPapers(CONTENT_ROOT).filter((p) => p.slidesFile);
let built = 0;
let assetsCopied = 0;
for (const paper of withSlides) {
  const src = path.join(CONTENT_ROOT, paper.slidesFile);
  const out = path.join(OUT_DIR, `${paper.slug}.html`);
  try {
    execFileSync('npx', ['--no-install', 'marp', '--html', '--output', out, src], {
      cwd: SITE_ROOT,
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    built++;
  } catch (err) {
    console.warn(`[slides] 렌더링 실패, 스킵: ${paper.slidesFile} (${err.message})`);
    continue;
  }
  // 슬라이드가 참조하는 상대경로 에셋(assets/*.png 등)을 함께 복사
  const md = fs.readFileSync(src, 'utf-8');
  const refs = [...new Set(md.match(/assets\/[^)"'\s]+/g) ?? [])];
  for (const ref of refs) {
    const assetSrc = path.join(path.dirname(src), ref);
    if (!fs.existsSync(assetSrc)) {
      console.warn(`[slides] 에셋 없음: ${paper.slidesFile} → ${ref}`);
      continue;
    }
    const assetOut = path.join(OUT_DIR, ref);
    fs.mkdirSync(path.dirname(assetOut), { recursive: true });
    fs.copyFileSync(assetSrc, assetOut);
    assetsCopied++;
  }
}
console.log(`[slides] ${built}/${withSlides.length} rendered, ${assetsCopied} assets → public/slides/`);
