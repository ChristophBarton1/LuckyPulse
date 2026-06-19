// Test stub for Nuxt's `#components` virtual module. Aliased in vitest.config.ts so
// components that `import { NuxtLink } from '#components'` resolve to a lightweight
// anchor in unit tests (no Nuxt runtime required).
import { defineComponent, h } from 'vue'

export const NuxtLink = defineComponent({
  name: 'NuxtLink',
  props: { to: { type: [String, Object], default: undefined } },
  setup(props, { slots }) {
    return () =>
      h('a', { href: typeof props.to === 'string' ? props.to : undefined }, slots.default?.())
  },
})
