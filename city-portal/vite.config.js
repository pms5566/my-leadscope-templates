import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Relative path builds
  build: {
    outDir: 'dist'
  }
});
