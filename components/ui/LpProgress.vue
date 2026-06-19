<script setup lang="ts">
/**
 * LpProgress — linear progress / meter bar.
 *
 * Used for participation %, countdown fill, XP. Follows the house pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant/size class maps (plain objects)
 *  - `cn()` to compose, logic kept out of the template via computeds
 *  - real semantic `role="progressbar"` + correct ARIA value state
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import { formatPercent } from '~/utils/format'

type Variant = 'gold' | 'accent' | 'green' | 'purple' | 'cyan'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    /** Current value, clamped into [0, max]. */
    value?: number
    max?: number
    variant?: Variant
    size?: Size
    /** Show the percentage on the right of the optional label row. */
    showLabel?: boolean
    /** Animated sweep instead of a fixed value; omits aria-valuenow. */
    indeterminate?: boolean
    /** Descriptive text shown above the bar. */
    label?: string
  }>(),
  {
    value: 0,
    max: 100,
    variant: 'accent',
    size: 'md',
    showLabel: false,
    indeterminate: false,
    label: undefined,
  },
)

/** Fill background per variant — gradients for accent/gold, solid token otherwise. */
const FILLS: Record<Variant, string> = {
  accent: 'bg-lp-accent-gradient',
  gold: 'bg-lp-gold-gradient',
  green: 'bg-lp-green',
  purple: 'bg-lp-purple',
  cyan: 'bg-lp-cyan',
}

const TRACK_SIZES: Record<Size, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

/** Normalised max guards against zero / negative inputs blowing up the ratio. */
const safeMax = computed(() => (props.max > 0 ? props.max : 100))

/** Value clamped into [0, max]. */
const clampedValue = computed(() => Math.min(Math.max(props.value, 0), safeMax.value))

const percent = computed(() => (clampedValue.value / safeMax.value) * 100)

const fillStyle = computed(() =>
  props.indeterminate ? undefined : { width: `${percent.value}%` },
)

const labelText = computed(() => (props.indeterminate ? '…' : formatPercent(percent.value, 0)))

const trackClasses = computed(() =>
  cn(
    'relative w-full overflow-hidden rounded-full bg-lp-surface-3',
    TRACK_SIZES[props.size],
  ),
)

const fillClasses = computed(() =>
  cn(
    'h-full rounded-full transition-[width] duration-500 ease-out',
    FILLS[props.variant],
    props.indeterminate && 'absolute inset-y-0 left-0 w-2/5 lp-shimmer animate-lp-progress-sweep',
  ),
)
</script>

<template>
  <div class="font-body">
    <div
      v-if="label || showLabel"
      class="mb-1.5 flex items-center justify-between gap-3"
    >
      <span v-if="label" class="text-xs font-medium text-lp-text-soft">{{ label }}</span>
      <span
        v-if="showLabel"
        class="ml-auto font-mono text-xs tabular-nums text-lp-text-muted"
      >{{ labelText }}</span>
    </div>

    <div
      :class="trackClasses"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="safeMax"
      :aria-valuenow="indeterminate ? undefined : clampedValue"
      :aria-label="label || undefined"
    >
      <div :class="fillClasses" :style="fillStyle" />
    </div>
  </div>
</template>

<style scoped>
@keyframes lp-progress-sweep {
  0% {
    transform: translateX(-110%);
  }
  100% {
    transform: translateX(310%);
  }
}

.animate-lp-progress-sweep {
  animation: lp-progress-sweep 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-lp-progress-sweep {
    animation: none;
    transform: none;
    width: 100%;
  }
}
</style>
