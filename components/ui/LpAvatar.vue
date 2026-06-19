<script setup lang="ts">
/**
 * LpAvatar — user/team avatar with a deterministic gradient fallback.
 *
 * Follows the canonical Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - mutually-exclusive size/shape/status class maps (plain objects)
 *  - `cn()` to compose classes, no external UI lib
 *  - SSR-safe: initials + gradient derive from pure functions of `name`
 *
 * No copyrighted logos: the fallback is a stable HSL gradient seeded from the
 * name's char-code hash, with up-to-two-letter initials on top.
 */
import { computed, ref } from 'vue'
import { cn } from '~/utils/cn'

type Size = 'xs' | 'sm' | 'md' | 'lg'
type Shape = 'circle' | 'rounded'
type Status = 'online' | 'offline' | 'busy' | 'live'

const props = withDefaults(
  defineProps<{
    /** Display name; drives initials and the deterministic gradient fallback. */
    name: string
    /** Optional image URL. Falls back to initials when absent or it errors. */
    src?: string
    size?: Size
    shape?: Shape
    /** Optional presence indicator dot, positioned bottom-right. */
    status?: Status
    /** Adds a 1px `lp-border-strong` ring around the avatar. */
    ring?: boolean
  }>(),
  {
    src: undefined,
    size: 'md',
    shape: 'circle',
    status: undefined,
    ring: false,
  },
)

const SIZES: Record<Size, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

const RADII: Record<Shape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-lp-md',
}

const STATUS_SIZES: Record<Size, string> = {
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
}

const STATUS_DOTS: Record<Status, string> = {
  online: 'bg-lp-green',
  offline: 'bg-lp-text-muted',
  busy: 'bg-lp-orange',
  live: 'bg-lp-red animate-lp-live',
}

const STATUS_LABELS: Record<Status, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  live: 'Live',
}

/** Stable, SSR-safe char-code hash of the name. */
function hashName(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

const initials = computed(() => {
  const words = props.name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const letters = words.slice(0, 2).map((word) => word[0])
  return letters.join('').toUpperCase()
})

/** Two hues ~40deg apart, derived from the hash, for the linear-gradient. */
const gradientStyle = computed(() => {
  const hue = hashName(props.name) % 360
  const hueB = (hue + 40) % 360
  return {
    backgroundImage: `linear-gradient(135deg, hsl(${hue} 62% 46%), hsl(${hueB} 64% 38%))`,
  }
})

/** Track image load failures so we can fall back to initials. */
const imageFailed = ref(false)
const showImage = computed(() => Boolean(props.src) && !imageFailed.value)

const rootClasses = computed(() =>
  cn(
    'relative inline-flex shrink-0 items-center justify-center align-middle select-none',
    'font-heading font-semibold text-white overflow-hidden',
    SIZES[props.size],
    RADII[props.shape],
    { 'ring-1 ring-lp-border-strong': props.ring },
  ),
)

const statusClasses = computed(() =>
  cn(
    'absolute bottom-0 right-0 rounded-full ring-2 ring-lp-bg',
    STATUS_SIZES[props.size],
    props.status ? STATUS_DOTS[props.status] : '',
  ),
)
</script>

<template>
  <span :class="rootClasses" :style="showImage ? undefined : gradientStyle">
    <img
      v-if="showImage"
      :src="src"
      :alt="name"
      loading="lazy"
      class="h-full w-full object-cover"
      @error="imageFailed = true"
    />
    <span v-else aria-hidden="true">{{ initials }}</span>

    <span
      v-if="status"
      :class="statusClasses"
      role="status"
      :aria-label="STATUS_LABELS[status]"
    />
  </span>
</template>
