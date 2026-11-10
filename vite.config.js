
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',

  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        desktop: resolve(__dirname, 'index.html'),
        mobile: resolve(__dirname, 'mobile.html'),
      },
    },
  },
});
