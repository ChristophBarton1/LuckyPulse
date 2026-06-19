<script setup lang="ts">
/**
 * LpSkeleton — loading placeholder built on the `lp-shimmer` utility.
 *
 * Follows the house Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - decorative bars are `aria-hidden`; the root announces a polite status
 *
 * Renders sensibly with no props (a single `rect` bar). The `text` variant
 * stacks `lines` bars, with the last bar shortened to ~60% width.
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'

type Variant = 'text' | 'rect' | 'circle' | 'card'
type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    /** CSS width, e.g. '100%' or '8rem'. For `circle` it also sets the height. */
    width?: string
    /** CSS height, e.g. '1.5rem'. Ignored by variants with a fixed height. */
    height?: string
    /** Corner rounding; defaults to a sensible value per variant. */
    rounded?: Rounded
    /** Number of stacked bars; only applies to the `text` variant. */
    lines?: number
  }>(),
  {
    variant: 'rect',
    width: undefined,
    height: undefined,
    rounded: undefined,
    lines: 1,
  },
)

const VARIANTS: Record<Variant, string> = {
  text: 'h-3 w-full',
  rect: 'h-4 w-full',
  circle: 'shrink-0',
  card: 'h-32 w-full',
}

const ROUNDED: Record<Rounded, string> = {
  sm: 'rounded-lp-sm',
  md: 'rounded-lp-md',
  lg: 'rounded-lp-lg',
  xl: 'rounded-lp-xl',
  full: 'rounded-full',
}

const DEFAULT_ROUNDED: Record<Variant, Rounded> = {
  text: 'sm',
  rect: 'md',
  circle: 'full',
  card: 'lg',
}

const resolvedRounded = computed<Rounded>(() => props.rounded ?? DEFAULT_ROUNDED[props.variant])

const isText = computed(() => props.variant === 'text')
const isCircle = computed(() => props.variant === 'circle')

/** Number of text bars to render (clamped to >= 1); other variants render a single bar. */
const lineCount = computed(() => (isText.value ? Math.max(1, Math.floor(props.lines)) : 1))

const barClass = computed(() =>
  cn(
    'block bg-lp-surface-2 lp-shimmer',
    VARIANTS[props.variant],
    ROUNDED[resolvedRounded.value],
  ),
)

/**
 * Inline style for a given bar index. The circle uses `width` for both
 * dimensions; the last text bar is shortened to ~60% for a natural cadence.
 */
function barStyle(index: number): Record<string, string> {
  const style: Record<string, string> = {}

  if (isCircle.value) {
    const size = props.width ?? '2.5rem'
    style.width = size
    style.height = size
    return style
  }

  if (props.width) style.width = props.width
  if (props.height) style.height = props.height

  if (isText.value && lineCount.value > 1 && index === lineCount.value - 1) {
    style.width = '60%'
  }

  return style
}
</script>

<template>
  <div
    role="status"
    aria-busy="true"
    :class="cn(isText && lineCount > 1 ? 'flex flex-col gap-2' : undefined)"
  >
    <span class="sr-only">Loading</span>
    <span
      v-for="index in lineCount"
      :key="index"
      :class="barClass"
      :style="barStyle(index - 1)"
      aria-hidden="true"
    />
  </div>
</template>
