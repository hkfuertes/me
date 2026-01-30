// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  site: 'https://mfuertes.net',
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwindcss(), yaml()]
  }
});