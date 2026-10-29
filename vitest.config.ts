/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Uses Astro's Vite config, so tests resolve the same `@/` imports as the site.
export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
