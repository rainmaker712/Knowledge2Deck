// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 배포 시 (Phase 3):
//   site: 'https://<user>.github.io', base: '/Knowledge2Deck'
// 환경변수로 주입해 로컬 빌드는 '/' 유지
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  vite: {
    plugins: [tailwindcss()],
  },
});
