import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://anaramarketing.com.au',
  vite: {
    plugins: [tailwindcss()],
  },
});
