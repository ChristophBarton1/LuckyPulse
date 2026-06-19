// LuckyPulse Nuxt config.
// Public pages render SSR; WS-heavy / canvas widgets opt into client-only per component.
export default defineNuxtConfig({
  compatibilityDate: '2025-06-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  // Single SCSS entry: design tokens -> animations -> utilities.
  css: ['~/assets/scss/main.scss'],

  // Self-hosted fonts for performance (no layout shift, no third-party requests at runtime).
  fonts: {
    families: [
      { name: 'Space Grotesk', provider: 'google', weights: [500, 600, 700] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  icon: {
    // Lucide via @iconify-json/lucide, used as <Icon name="lucide:zap" />.
    mode: 'svg',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'LuckyPulse — Sports & Esports Prediction Rooms',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Automated realtime sports & esports prediction rooms. Virtual points only. No real-money betting.',
        },
        { name: 'theme-color', content: '#050711' },
      ],
    },
  },

  // Strict types everywhere; type-check runs via the `typecheck` script (kept out of dev for speed).
  typescript: { strict: true, typeCheck: false },
})
