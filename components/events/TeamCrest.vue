<script setup lang="ts">
/**
 * TeamCrest — premium, legal-safe team/club crest (NO copyrighted logos).
 *
 * Renders a hexagonal shield with a metallic rim, a deterministic muted team hue,
 * a subtle top sheen, and the team's monogram. Distinct per team but kept dark and
 * on-palette (neutral charcoal + faint hue) so it never looks like an AI rainbow.
 *
 * House pattern: typed props, pure SSR-safe computeds, token-driven colors.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)

/** Monogram: first letters of up to two words, else first two chars. */
const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean)
  const raw =
    words.length >= 2 ? words[0][0] + words[1][0] : (words[0] ?? '').slice(0, 2)
  return raw.toUpperCase()
})

/** Stable hue from the name (pure -> SSR-safe), kept low-saturation. */
const hue = computed(() => {
  let h = 0
  for (let i = 0; i < props.name.length; i++) h = (h * 31 + props.name.charCodeAt(i)) % 360
  return h
})

const fill = computed(
  () => `linear-gradient(150deg, hsl(${hue.value} 24% 27%), var(--lp-surface))`,
)

const HEX = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)'

const SIZES: Record<NonNullable<typeof props.size>, { box: string; text: string }> = {
  sm: { box: 'h-9 w-9', text: 'text-[11px]' },
  md: { box: 'h-12 w-12', text: 'text-base' },
  lg: { box: 'h-16 w-16', text: 'text-xl' },
  xl: { box: 'h-20 w-20', text: 'text-2xl' },
}
</script>

<template>
  <div
    class="relative inline-grid shrink-0 place-items-center"
    :class="SIZES[size].box"
    role="img"
    :aria-label="`${name} crest`"
  >
    <!-- Metallic rim (slightly larger hexagon behind the fill). -->
    <div
      class="absolute inset-0"
      :style="{
        clipPath: HEX,
        background: 'linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 55%, rgba(0,0,0,0.25))',
      }"
      aria-hidden="true"
    />
    <!-- Fill (inset reveals the rim as a hairline border). -->
    <div
      class="absolute inset-[1.5px]"
      :style="{ clipPath: HEX, background: fill }"
      aria-hidden="true"
    />
    <!-- Top sheen. -->
    <div
      class="absolute inset-[1.5px]"
      :style="{
        clipPath: HEX,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.16), transparent 45%)',
      }"
      aria-hidden="true"
    />
    <!-- Monogram. -->
    <span
      class="relative font-heading font-bold leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
      :class="SIZES[size].text"
    >
      {{ initials }}
    </span>
  </div>
</template>
