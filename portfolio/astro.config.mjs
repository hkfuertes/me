// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  site: 'https://mfuertes.net',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), yaml()]
  }
});