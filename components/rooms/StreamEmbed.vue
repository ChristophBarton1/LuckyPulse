<script setup lang="ts">
/**
 * StreamEmbed — legal, official Twitch / YouTube embed (never rehosted content).
 *
 * Performance + UX:
 *  - the iframe is only created when needed (lazy): a `featured` embed autoplays
 *    (muted) once it scrolls into view; non-featured embeds play on hover/focus and
 *    can be pinned with a click/tap. Leaving collapses back to the poster, so only a
 *    couple of players are ever live at once.
 *  - `parent` is derived from the current host at runtime, so the same code works on
 *    localhost and any deploy domain.
 *
 * Legal note: Twitch/YouTube serve the stream and handle rights + ads; we keep their
 * native player controls and branding.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { StreamInfo } from '~/types/domain'

const props = withDefaults(
  defineProps<{
    stream: StreamInfo
    /** Featured player autoplays (muted) when scrolled into view. */
    featured?: boolean
    /** Show the LIVE badge + viewer count overlay. */
    live?: boolean
  }>(),
  { featured: false, live: true },
)

const root = ref<HTMLElement | null>(null)
const host = ref('')
const active = ref(false)
const pinned = ref(false)

onMounted(() => {
  host.value = window.location.hostname || 'localhost'
  if (props.featured) {
    // Autoplay (muted) once visible — but only build the iframe when actually on screen.
    const { stop } = useIntersectionObserver(root, ([entry]) => {
      if (entry?.isIntersecting) {
        active.value = true
        stop()
      }
    })
  }
})

onBeforeUnmount(() => {
  active.value = false
})

const embedSrc = computed(() => {
  if (!host.value) return ''
  const s = props.stream
  if (s.provider === 'youtube' && s.videoId) {
    return `https://www.youtube.com/embed/${s.videoId}?autoplay=1&mute=1&playsinline=1&rel=0`
  }
  if (s.provider === 'twitch' && s.channel) {
    return `https://player.twitch.tv/?channel=${s.channel}&parent=${host.value}&muted=true&autoplay=true`
  }
  return ''
})

const label = computed(() => props.stream.streamer ?? props.stream.channel ?? 'Live stream')
const monogram = computed(() => label.value.slice(0, 1).toUpperCase())

function onEnter(): void {
  if (!props.featured) active.value = true
}
function onLeave(): void {
  if (!props.featured && !pinned.value) active.value = false
}
function onActivate(): void {
  active.value = true
  pinned.value = true
}
</script>

<template>
  <div
    ref="root"
    class="group relative aspect-video w-full overflow-hidden rounded-lp-lg border border-lp-border bg-lp-surface-2"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Live player (client-only; only mounted when active). -->
    <ClientOnly>
      <iframe
        v-if="active && embedSrc"
        :src="embedSrc"
        :title="`${label} live stream`"
        class="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowfullscreen
        frameborder="0"
        loading="lazy"
      />
    </ClientOnly>

    <!-- Poster / activation surface (hidden once a player is active). -->
    <button
      v-if="!active"
      type="button"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      :aria-label="`Play ${label} stream`"
      @click="onActivate"
      @focusin="onEnter"
      @focusout="onLeave"
    >
      <!-- Thumbnail (Helix) or gradient fallback. -->
      <img
        v-if="stream.thumbnail"
        :src="stream.thumbnail"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      >
      <div
        v-else
        class="absolute inset-0 grid place-items-center bg-lp-surface-gradient"
        aria-hidden="true"
      >
        <span class="font-heading text-3xl font-bold text-lp-text-muted">{{ monogram }}</span>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-lp-bg/85 via-lp-bg/25 to-transparent" />

      <!-- Play affordance -->
      <span
        class="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-lp-red-gradient text-white shadow-glow-red transition-transform duration-150 group-hover:scale-110"
      >
        <Icon name="lucide:play" :size="20" class="ml-0.5" aria-hidden="true" />
      </span>
    </button>

    <!-- Top overlay: LIVE + provider + viewers -->
    <div class="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2">
      <LpBadge v-if="live" variant="red" uppercase pulse dot>Live</LpBadge>
      <span
        class="inline-flex items-center gap-1 rounded-full bg-lp-bg/70 px-2 py-0.5 font-mono text-[11px] text-lp-text-soft backdrop-blur-sm"
      >
        <Icon
          :name="stream.provider === 'youtube' ? 'lucide:youtube' : 'lucide:twitch'"
          :size="12"
          aria-hidden="true"
        />
        {{ stream.provider === 'youtube' ? 'YouTube' : 'Twitch' }}
      </span>
    </div>

    <!-- Bottom overlay: title / streamer -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 bg-gradient-to-t from-lp-bg/90 to-transparent p-3"
    >
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-lp-text">{{ label }}</p>
        <p v-if="stream.title" class="truncate text-xs text-lp-text-muted">{{ stream.title }}</p>
      </div>
      <span
        v-if="stream.viewers"
        class="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-lp-text-soft"
      >
        <Icon name="lucide:users" :size="12" aria-hidden="true" />
        {{ stream.viewers.toLocaleString('en-US') }}
      </span>
    </div>
  </div>
</template>
