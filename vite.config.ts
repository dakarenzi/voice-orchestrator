import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    conditions: ['svelte', 'browser', 'import'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  ssr: {
    resolve: {
      conditions: ['svelte']
    }
  },
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true,
  }
});
