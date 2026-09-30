import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    // A zone west of UTC surfaces date-only off-by-one bugs.
    env: { TZ: 'America/Los_Angeles' },
  },
});
