import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['api/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      include: ['api/character/parse.ts'],
      reporter: ['text', 'text-summary'],
      thresholds: {
        lines: 85,
        '**/api/character/parse.ts': {
          lines: 85,
        },
      },
    },
  },
});
