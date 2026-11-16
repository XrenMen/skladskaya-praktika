import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://xrenmen.github.io',
  base: '/skladskaya-praktika',
  trailingSlash: 'always',
  output: 'static',
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});