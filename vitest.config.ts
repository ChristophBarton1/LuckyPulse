import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

// happy-dom is enough for pure component tests and is much faster than the full Nuxt env.
// Tests that need Nuxt runtime can opt in with `// @vitest-environment nuxt`.
export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      // Resolve Nuxt's `#components` to a test stub (provides NuxtLink as a plain <a>).
      '#components': fileURLToPath(new URL('./tests/stubs/nuxt-components.ts', import.meta.url)),
    },
  },
})
