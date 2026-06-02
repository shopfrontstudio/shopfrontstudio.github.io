import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://shopfrontstudio.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
