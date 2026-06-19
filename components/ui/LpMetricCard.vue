<script setup lang="ts">
/**
 * LpMetricCard — dashboard stat card (e.g. "Active Users 24,568 +12.5%").
 *
 * House pattern (mirrors LpButton):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive accent class maps (plain objects)
 *  - `cn()` to compose, display logic kept in computeds / format helpers
 *  - real semantic markup + accent-tinted icon chip
 *
 * Built on top of <LpCard variant="elevated"> (auto-imported global component).
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import { formatPoints, formatDelta } from '~/utils/format'

type Accent = 'neutral' | 'gold' | 'purple' | 'cyan' | 'green' | 'accent'

const props = withDefaults(
  defineProps<{
    /** Short metric name, rendered as an uppercase mono label. */
    label: string
    /** The metric value. Numbers are formatted with `formatPoints`. */
    value: string | number
    /** Lucide icon name (without the `lucide:` prefix) for the chip. */
    icon?: string
    /** Tints the icon chip + trend-neutral emphasis. */
    accent?: Accent
    /** Signed change; positive → green, negative → red, shown via `formatDelta`. */
    trend?: number
    /** Optional context after the delta, e.g. "vs last hour". */
    trendLabel?: string
    /** Optional small muted helper line. */
    hint?: string
  }>(),
  {
    icon: undefined,
    accent: 'accent',
    trend: undefined,
    trendLabel: undefined,
    hint: undefined,
  },
)

/** Background + text color for the icon chip, per accent. */
const CHIP: Record<Accent, string> = {
  neutral: 'bg-lp-surface-3 text-lp-text-soft',
  gold: 'bg-lp-gold/15 text-lp-gold',
  purple: 'bg-lp-purple/15 text-lp-purple',
  cyan: 'bg-lp-cyan/15 text-lp-cyan',
  green: 'bg-lp-green/15 text-lp-green',
  accent: 'bg-lp-accent/15 text-lp-accent',
}

const displayValue = computed(() =>
  typeof props.value === 'number' ? formatPoints(props.value) : props.value,
)

const hasTrend = computed(() => typeof props.trend === 'number')

const trendUp = computed(() => (props.trend ?? 0) >= 0)

const trendText = computed(() => (hasTrend.value ? formatDelta(props.trend as number) : ''))

const trendClasses = computed(() =>
  cn(
    'inline-flex items-center gap-1 font-mono text-xs font-medium',
    trendUp.value ? 'text-lp-green' : 'text-lp-red',
  ),
)

const chipClasses = computed(() =>
  cn(
    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lp-md',
    CHIP[props.accent],
  ),
)
</script>

<template>
  <LpCard variant="elevated">
    <div class="flex flex-col gap-3">
      <!-- Top row: label + accent icon chip -->
      <div class="flex items-start justify-between gap-3">
        <p class="font-mono text-xs uppercase tracking-wide text-lp-text-muted">
          {{ label }}
        </p>
        <span v-if="icon" :class="chipClasses">
          <Icon :name="`lucide:${icon}`" :size="18" aria-hidden="true" />
        </span>
      </div>

      <!-- Big metric value -->
      <p class="font-mono text-2xl font-semibold leading-none text-lp-text">
        {{ displayValue }}
      </p>

      <!-- Trend chip row -->
      <p v-if="hasTrend" class="flex items-center gap-1.5">
        <span :class="trendClasses">
          <Icon
            :name="trendUp ? 'lucide:trending-up' : 'lucide:trending-down'"
            :size="14"
            aria-hidden="true"
          />
          {{ trendText }}
        </span>
        <span v-if="trendLabel" class="font-body text-xs text-lp-text-muted">
          {{ trendLabel }}
        </span>
      </p>

      <!-- Hint -->
      <p v-if="hint" class="font-body text-xs text-lp-text-muted">
        {{ hint }}
      </p>
    </div>
  </LpCard>
</template>
