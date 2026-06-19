<script setup lang="ts">
/**
 * LpEmptyState — friendly empty placeholder for absent collections
 * (no rooms yet, no picks, an empty leaderboard, etc).
 *
 * Follows the house Lp* pattern: typed `withDefaults(defineProps<...>())`,
 * `cn()` composition, real semantic elements, and a visible focus ring on
 * any interactive control. The default action reuses <LpButton> so it stays
 * in lockstep with the canonical button styling; pass the `actions` slot to
 * fully replace the action area.
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    /** Headline shown beneath the icon. */
    title: string
    /** Optional supporting line under the title. */
    description?: string
    /** Lucide icon name (without the `lucide:` prefix). */
    icon?: string
    /** When set, renders a primary call-to-action. */
    actionLabel?: string
    /** Route string; when set the action becomes a NuxtLink, otherwise a button that emits `action`. */
    actionTo?: string
  }>(),
  {
    description: undefined,
    icon: 'inbox',
    actionLabel: undefined,
    actionTo: undefined,
  },
)

const emit = defineEmits<{ action: [event: MouseEvent] }>()

const rootClasses = cn(
  'flex flex-col items-center justify-center text-center',
  'py-12 gap-3 animate-lp-fade-in',
)

const chipClasses = cn(
  'flex items-center justify-center',
  'h-14 w-14 rounded-full',
  'bg-lp-surface-2 border border-lp-border text-lp-text-muted',
)

const hasAction = computed(() => Boolean(props.actionLabel))

function onAction(event: MouseEvent): void {
  emit('action', event)
}
</script>

<template>
  <div :class="rootClasses">
    <span :class="chipClasses" aria-hidden="true">
      <Icon :name="`lucide:${icon}`" :size="26" aria-hidden="true" />
    </span>

    <h3 class="font-heading text-lg text-lp-text">{{ title }}</h3>

    <p v-if="description" class="font-body text-sm text-lp-text-muted max-w-sm text-center">
      {{ description }}
    </p>

    <div v-if="$slots.actions || hasAction" class="mt-1">
      <slot name="actions">
        <LpButton
          v-if="hasAction"
          variant="primary"
          size="md"
          :to="actionTo"
          @click="onAction"
        >
          {{ actionLabel }}
        </LpButton>
      </slot>
    </div>
  </div>
</template>
