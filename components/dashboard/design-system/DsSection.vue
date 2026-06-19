<script setup lang="ts">
// Documentation section wrapper for the design-system showcase: anchored heading,
// optional description, and a content slot. Keeps the showcase page composable.
withDefaults(
  defineProps<{
    id: string
    title: string
    description?: string
  }>(),
  { description: undefined },
)
</script>

<template>
  <section :id="id" class="scroll-mt-24">
    <header class="mb-5 border-b border-lp-border pb-3">
      <h2 class="font-heading text-xl font-semibold text-lp-text">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm text-lp-text-muted">{{ description }}</p>
    </header>
    <slot />
  </section>
</template>
