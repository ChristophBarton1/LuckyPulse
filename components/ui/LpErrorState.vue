<script setup lang="ts">
/**
 * LpErrorState — error placeholder with optional retry.
 *
 * Used when a view fails to load (failed to load room, adapter error, etc.).
 * Mirrors the LpEmptyState layout but the icon chip is red-tinted to signal a
 * fault rather than an empty result. Surfaces a retry affordance that emits
 * `retry`, plus an `actions` slot for additional controls.
 *
 * Follows the house Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - `cn()` to compose classes, no external UI lib
 *  - real semantic element + correct ARIA (`role="alert"`)
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import LpButton from '~/components/ui/LpButton.vue'

const props = withDefaults(
  defineProps<{
    /** Headline shown in the error chip. */
    title?: string
    /** Optional supporting copy below the title. */
    description?: string
    /** Lucide icon name (without the `lucide:` prefix). */
    icon?: string
    /** When true, renders the built-in retry button. */
    retryable?: boolean
    /** Label for the retry button. */
    retryLabel?: string
  }>(),
  {
    title: 'Something went wrong',
    description: undefined,
    icon: 'triangle-alert',
    retryable: true,
    retryLabel: 'Try again',
  },
)

defineEmits<{ retry: [] }>()

const rootClasses = computed(() =>
  cn(
    'flex flex-col items-center justify-center text-center',
    'gap-4 px-6 py-12 font-body animate-lp-fade-in',
  ),
)

const chipClasses = computed(() =>
  cn(
    'inline-flex items-center justify-center',
    'h-14 w-14 rounded-lp-lg',
    'bg-lp-red/12 border border-lp-red/30 text-lp-red',
  ),
)

const hasDescription = computed(() => Boolean(props.description))
</script>

<template>
  <div role="alert" :class="rootClasses">
    <span :class="chipClasses">
      <Icon :name="`lucide:${icon}`" :size="26" aria-hidden="true" />
    </span>

    <div class="flex flex-col items-center gap-1.5">
      <h2 class="font-heading text-lg text-lp-text">{{ title }}</h2>
      <p v-if="hasDescription" class="max-w-sm text-sm text-lp-text-muted">
        {{ description }}
      </p>
    </div>

    <div v-if="retryable || $slots.actions" class="flex flex-wrap items-center justify-center gap-3">
      <LpButton
        v-if="retryable"
        variant="secondary"
        size="md"
        icon="rotate-ccw"
        @click="$emit('retry')"
      >
        {{ retryLabel }}
      </LpButton>
      <slot name="actions" />
    </div>
  </div>
</template>
