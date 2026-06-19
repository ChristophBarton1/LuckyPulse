<script setup lang="ts">
/**
 * DailySpinPreview — presentational preview of the daily reward wheel.
 *
 * This is a STATIC preview only: no spin animation or logic lives here (the full
 * interactive wheel is a separate, lazy-loaded component). Rewards are VIRTUAL
 * POINTS / XP / cosmetics only — never real money.
 *
 * Follows the house Lp* pattern (see LpButton.vue / LpCard.vue):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - all data prop-driven, no internal mock content / fetching
 *  - reuses the Lp* base kit (LpCard, LpButton, LpBadge) for surfaces / CTAs
 *  - pure CSS visuals, SSR-safe (angles computed in script, no window access)
 */
import { computed } from 'vue'
import type { SpinSegment } from '~/types/domain'

const props = withDefaults(
  defineProps<{
    /** Wheel segments (virtual-point / XP / cosmetic rewards only). */
    segments: SpinSegment[]
    /** Remaining spins for the current user today. */
    spinsLeft: number
    /** Human countdown until the daily allowance resets, e.g. "07:42:10". */
    resetsInLabel: string
  }>(),
  {
    spinsLeft: 0,
  },
)

defineEmits<{ spin: [event: MouseEvent] }>()

/** Degrees per slice; guard against an empty segment list. */
const step = computed(() => (props.segments.length > 0 ? 360 / props.segments.length : 360))

/**
 * Inline conic-gradient disc background. Each slice spans `step` degrees and
 * alternates between two design tokens so neighbouring slices read distinctly.
 * Returns a CSS `background` string (SSR-safe, pure computation).
 */
const discBackground = computed(() => {
  const count = props.segments.length
  if (count === 0) return 'var(--lp-surface-3)'

  const stops: string[] = []
  for (let i = 0; i < count; i++) {
    const color =
      i % 2 === 0
        ? 'color-mix(in srgb, var(--lp-red) 30%, var(--lp-surface-2))'
        : 'var(--lp-surface-3)'
    const from = (i * step.value).toFixed(3)
    const to = ((i + 1) * step.value).toFixed(3)
    stops.push(`${color} ${from}deg ${to}deg`)
  }
  return `conic-gradient(from 0deg, ${stops.join(', ')})`
})

/**
 * Per-segment label placement. Each label is rotated to the centre of its slice
 * (half a step past the slice start) and pushed to the rim via translateY.
 */
const labelTransform = (index: number): string =>
  `rotate(${(index * step.value + step.value / 2).toFixed(3)}deg) translateY(-46%)`

const canSpin = computed(() => props.spinsLeft > 0)
</script>

<template>
  <LpCard
    variant="elevated"
    glow="gold"
    class="flex flex-col items-center"
    aria-label="Daily Spin reward wheel preview"
  >
    <!-- Header -->
    <header class="flex w-full items-center justify-between">
      <h2 class="font-heading text-base font-semibold text-lp-text">Daily Spin</h2>
      <p class="flex items-center gap-1.5 font-mono text-xs text-lp-text-muted">
        <Icon name="lucide:timer" :size="13" aria-hidden="true" />
        <span>Resets in {{ resetsInLabel }}</span>
      </p>
    </header>

    <!-- Wheel (presentational, no spin animation) -->
    <div
      class="relative mx-auto my-4 aspect-square w-[220px] select-none"
      role="img"
      aria-label="Reward wheel preview showing virtual point segments"
    >
      <!-- Pointer at top centre -->
      <Icon
        name="lucide:triangle"
        :size="22"
        class="absolute -top-1.5 left-1/2 z-20 -translate-x-1/2 rotate-180 text-lp-gold drop-shadow"
        aria-hidden="true"
      />

      <!-- Conic-gradient disc -->
      <div
        class="absolute inset-0 rounded-full ring-4 ring-lp-surface-2 shadow-glow-gold"
        :style="{ background: discBackground }"
      >
        <!-- Segment labels, rotated to their slice and pushed to the rim -->
        <span
          v-for="(segment, index) in segments"
          :key="`${segment.label}-${index}`"
          class="absolute left-1/2 top-1/2 origin-center whitespace-nowrap font-mono text-xs font-medium text-lp-text"
          :style="{ transform: `translate(-50%, -50%) ${labelTransform(index)}` }"
        >
          {{ segment.label }}
        </span>
      </div>

      <!-- Center hub -->
      <div
        class="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lp-gold-gradient font-heading text-lg font-bold text-lp-bg ring-4 ring-lp-surface shadow-glow-gold"
        aria-hidden="true"
      >
        LP
      </div>
    </div>

    <!-- Reward-type note -->
    <LpBadge variant="gold" icon="gift" class="mb-3">Virtual points &amp; cosmetics</LpBadge>

    <!-- Primary CTA -->
    <LpButton
      variant="gold"
      block
      icon="sparkles"
      :disabled="!canSpin"
      @click="$emit('spin', $event)"
    >
      Spin Now ({{ spinsLeft }} Left)
    </LpButton>

    <!-- Muted footer line -->
    <p class="mt-3 text-center text-xs text-lp-text-muted">
      Come back tomorrow for more spins!
    </p>
  </LpCard>
</template>
