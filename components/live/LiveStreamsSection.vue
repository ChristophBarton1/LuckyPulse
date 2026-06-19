<script setup lang="ts">
/**
 * LiveStreamsSection — real, legal live streams on the Live Hub, grouped by esports
 * category. Pulls currently-live Twitch channels from /api/streams/live (Helix when a
 * dev app is configured, curated fallback otherwise); the top stream autoplays muted,
 * the rest play on hover. Sports categories have no embeddable broadcast, so they point
 * to the legal Watch Companion instead.
 */
import { computed, ref } from 'vue'
import type { StreamInfo } from '~/types/domain'

const CATEGORIES = [
  { value: 'moba', label: 'MOBA', icon: 'swords' },
  { value: 'tactical-shooter', label: 'Tactical Shooter', icon: 'crosshair' },
  { value: 'battle-royale', label: 'Battle Royale', icon: 'gamepad-2' },
]

const category = ref('moba')

// Reactive query: changing `category` auto-refetches (client-side).
const { data, pending } = await useFetch('/api/streams/live', {
  query: { category, first: 7 },
  default: () => ({ source: 'fallback', category: 'moba', streams: [] as StreamInfo[] }),
})

const streams = computed<StreamInfo[]>(() => data.value?.streams ?? [])
const featured = computed(() => streams.value[0])
const rest = computed(() => streams.value.slice(1, 7))
const isLive = computed(() => data.value?.source === 'twitch-live')
</script>

<template>
  <section aria-labelledby="live-streams-heading" class="flex flex-col gap-3">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <h2 id="live-streams-heading" class="font-heading text-lg font-semibold text-lp-text">
          Live Streams
        </h2>
        <LpBadge v-if="isLive" variant="red" uppercase pulse dot>Live</LpBadge>
        <span class="inline-flex items-center gap-1 rounded-full bg-lp-surface-2 px-2 py-0.5 font-mono text-[11px] text-lp-text-muted">
          <Icon name="lucide:twitch" :size="12" aria-hidden="true" /> Twitch
        </span>
      </div>
      <NuxtLink
        to="/esports"
        class="rounded-lp-sm text-xs text-lp-text-muted transition-colors hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      >
        View all
      </NuxtLink>
    </div>

    <!-- Category tabs -->
    <LpTabs v-model="category" :tabs="CATEGORIES" />

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <LpSkeleton variant="card" class="lg:col-span-2" height="14rem" />
      <div class="grid grid-cols-2 gap-3">
        <LpSkeleton v-for="i in 4" :key="i" variant="rect" height="6rem" />
      </div>
    </div>

    <!-- Streams -->
    <div v-else-if="featured" class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <StreamEmbed :stream="featured" featured :live="isLive" />
      </div>
      <div v-if="rest.length" class="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <StreamEmbed
          v-for="s in rest.slice(0, 4)"
          :key="s.channel ?? s.videoId"
          :stream="s"
          :live="isLive"
        />
      </div>
    </div>

    <!-- Empty -->
    <LpEmptyState
      v-else
      title="No live streams right now"
      description="Nobody is streaming this category at the moment — check back, or open a prediction room."
      icon="tv"
    />

    <!-- Sports note (no embeddable broadcast) -->
    <p class="flex items-center gap-1.5 font-mono text-[11px] text-lp-text-muted">
      <Icon name="lucide:info" :size="12" aria-hidden="true" />
      Sports events stream rights-protected — open a room to follow them in the Watch Companion.
    </p>
  </section>
</template>
