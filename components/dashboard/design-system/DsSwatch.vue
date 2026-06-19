<script setup lang="ts">
// A single design-token color swatch: the live color block + token name + CSS var.
defineProps<{
  /** Human label, e.g. "Gold". */
  label: string
  /** The CSS custom property to render, e.g. "--lp-gold". */
  token: string
  /** Hint that the color is light, so the preview chip uses dark text. */
  light?: boolean
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lp-md border border-lp-border bg-lp-surface">
    <div
      class="flex h-16 items-end p-2"
      :style="{ background: `var(${token})` }"
    >
      <span
        class="font-mono text-[10px]"
        :class="light ? 'text-lp-bg/70' : 'text-lp-text/70'"
      >
        {{ token }}
      </span>
    </div>
    <div class="px-2.5 py-2">
      <p class="text-xs font-medium text-lp-text">{{ label }}</p>
    </div>
  </div>
</template>
