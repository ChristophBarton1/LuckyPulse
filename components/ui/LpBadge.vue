<script setup lang="ts">
/**
 * LpBadge — small status/label pill (LIVE, STARTING, VIP, point tags...).
 *
 * Follows the house Lp* pattern (see LpButton.vue):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive variant/size class maps (plain objects)
 *  - `cn()` to compose, no external UI lib
 *  - real semantic element + correct ARIA
 *
 * Color variants pair a low-opacity tint of the token with its solid text color.
 * `pulse` drives the LIVE animation on the dot (or the badge when no dot is shown).
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'

type Variant =
  | 'neutral'
  | 'gold'
  | 'purple'
  | 'cyan'
  | 'green'
  | 'red'
  | 'orange'
  | 'accent'
  | 'outline'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Lucide icon name (without the `lucide:` prefix), shown before the label. */
    icon?: string
    /** Leading filled status dot in the variant color. */
    dot?: boolean
    /** Animate the dot (or the badge, when no dot) with the LIVE pulse. */
    pulse?: boolean
    /** Uppercase, wide-tracked mono text — for status labels like LIVE. */
    uppercase?: boolean
  }>(),
  {
    variant: 'neutral',
    size: 'sm',
    icon: undefined,
    dot: false,
    pulse: false,
    uppercase: false,
  },
)

const VARIANTS: Record<Variant, string> = {
  neutral: 'bg-lp-surface-3 text-lp-text-soft',
  gold: 'bg-lp-gold/15 text-lp-gold',
  purple: 'bg-lp-purple/15 text-lp-purple',
  cyan: 'bg-lp-cyan/15 text-lp-cyan',
  green: 'bg-lp-green/15 text-lp-green',
  red: 'bg-lp-red/15 text-lp-red',
  orange: 'bg-lp-orange/15 text-lp-orange',
  accent: 'bg-lp-accent/15 text-lp-accent',
  outline: 'border border-lp-border-strong text-lp-text-soft bg-transparent',
}

/** Solid fill color for the leading dot, per variant. */
const DOT_COLORS: Record<Variant, string> = {
  neutral: 'bg-lp-text-soft',
  gold: 'bg-lp-gold',
  purple: 'bg-lp-purple',
  cyan: 'bg-lp-cyan',
  green: 'bg-lp-green',
  red: 'bg-lp-red',
  orange: 'bg-lp-orange',
  accent: 'bg-lp-accent',
  outline: 'bg-lp-text-soft',
}

const SIZES: Record<Size, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1',
}

const ICON_SIZE: Record<Size, number> = { sm: 12, md: 13 }
const DOT_SIZE: Record<Size, string> = { sm: 'h-1.5 w-1.5', md: 'h-2 w-2' }

const badgeClasses = computed(() =>
  cn(
    'inline-flex items-center rounded-full font-medium whitespace-nowrap select-none align-middle',
    props.uppercase ? 'font-mono uppercase tracking-wide' : 'font-body',
    VARIANTS[props.variant],
    SIZES[props.size],
    // Pulse the whole badge only when there is no dot to carry the animation.
    { 'animate-lp-live': props.pulse && !props.dot },
  ),
)

const dotClasses = computed(() =>
  cn(
    'shrink-0 rounded-full',
    DOT_SIZE[props.size],
    DOT_COLORS[props.variant],
    { 'animate-lp-live': props.pulse },
  ),
)
</script>

<template>
  <span :class="badgeClasses">
    <span v-if="dot" :class="dotClasses" aria-hidden="true" />
    <Icon
      v-else-if="icon"
      :name="`lucide:${icon}`"
      :size="ICON_SIZE[size]"
      aria-hidden="true"
    />
    <slot />
  </span>
</template>
