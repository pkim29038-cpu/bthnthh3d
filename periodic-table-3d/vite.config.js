import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        element: resolve(import.meta.dirname, 'element.html'),
        group: resolve(import.meta.dirname, 'group.html'),
        period: resolve(import.meta.dirname, 'period.html')
      }
    }
  }
});
