<script setup lang="ts">
/**
 * LpStatusDot — tiny colored status indicator (LIVE / online / upcoming / ...),
 * optionally labeled.
 *
 * Follows the house pattern (see LpButton.vue):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real semantics + accessible status text
 *
 * Labeled: inline-flex dot + label. Unlabeled: the dot carries `role="status"`
 * with an sr-only description so it is announced to assistive tech.
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'

type Status =
  | 'live'
  | 'online'
  | 'upcoming'
  | 'resolving'
  | 'offline'
  | 'error'
  | 'success'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    status?: Status
    size?: Size
    /** Force the live-style pulse animation. Defaults to true only for `live`. */
    pulse?: boolean
    /** Optional text shown next to the dot. */
    label?: string
  }>(),
  {
    status: 'online',
    size: 'sm',
    pulse: undefined,
    label: undefined,
  },
)

const COLORS: Record<Status, string> = {
  live: 'bg-lp-red',
  online: 'bg-lp-green',
  success: 'bg-lp-green',
  upcoming: 'bg-lp-orange',
  resolving: 'bg-lp-cyan',
  offline: 'bg-lp-text-muted',
  error: 'bg-lp-red',
}

const SIZES: Record<Size, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
}

/** Human-readable status text for screen readers when no label is given. */
const STATUS_TEXT: Record<Status, string> = {
  live: 'Live',
  online: 'Online',
  success: 'Success',
  upcoming: 'Upcoming',
  resolving: 'Resolving',
  offline: 'Offline',
  error: 'Error',
}

const shouldPulse = computed(() =>
  props.pulse === undefined ? props.status === 'live' : props.pulse,
)

const dotClasses = computed(() =>
  cn(
    'inline-block shrink-0 rounded-full',
    COLORS[props.status],
    SIZES[props.size],
    { 'animate-lp-live': shouldPulse.value },
  ),
)
</script>

<template>
  <span
    v-if="label"
    class="inline-flex items-center gap-1.5 align-middle"
  >
    <span :class="dotClasses" aria-hidden="true" />
    <span class="font-mono text-xs text-lp-text-soft">{{ label }}</span>
  </span>
  <span
    v-else
    role="status"
    :class="cn(dotClasses, 'align-middle')"
  >
    <span class="sr-only">{{ STATUS_TEXT[status] }}</span>
  </span>
</template>
