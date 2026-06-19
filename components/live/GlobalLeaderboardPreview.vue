<script setup lang="ts">
/**
 * GlobalLeaderboardPreview — compact, prop-driven leaderboard list card.
 *
 * Follows the house Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`, imported from '~/types/domain'
 *  - reuses the Lp* base kit (LpCard surface, LpAvatar)
 *  - only token utilities (no raw colors), font-mono for all numeric figures
 *  - literal <NuxtLink> for the "View All" link, with a visible focus ring
 *  - SSR-safe: pure functions, no window/document access during setup
 *
 * Data only: the parent page supplies `entries`; nothing is fetched or mocked here.
 */
import { computed } from 'vue'
import type { LeaderboardEntry } from '~/types/domain'
import { formatPoints } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    /** Ranked leaderboard rows, supplied by the page. */
    entries?: LeaderboardEntry[]
  }>(),
  {
    entries: () => [],
  },
)

type Marker = NonNullable<LeaderboardEntry['marker']>

/** Lucide icon + token color + accessible label per profile marker. */
const MARKERS: Record<Marker, { icon: string; color: string; label: string }> = {
  vip: { icon: 'crown', color: 'text-lp-gold', label: 'VIP member' },
  verified: { icon: 'badge-check', color: 'text-lp-cyan', label: 'Verified' },
  host: { icon: 'shield', color: 'text-lp-purple', label: 'Room host' },
}

/** Medal tint for podium ranks; falls back to muted for the rest. */
const PODIUM_COLORS: Record<number, string> = {
  1: 'text-lp-gold',
  2: 'text-lp-text-soft',
  3: 'text-lp-orange',
}

function isPodium(rank: number): boolean {
  return rank >= 1 && rank <= 3
}

const rows = computed(() => props.entries)
</script>

<template>
  <LpCard padding="none">
    <template #header>
      <div class="flex items-center justify-between px-4 py-3">
        <h2 class="font-heading text-sm font-semibold text-lp-text">
          Global Leaderboard
        </h2>
        <NuxtLink
          to="/leaderboard"
          class="inline-flex items-center gap-1 rounded-lp-sm px-1.5 py-0.5 font-body text-xs font-medium text-lp-accent transition-colors hover:text-lp-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        >
          View All
          <Icon name="lucide:chevron-right" :size="14" aria-hidden="true" />
        </NuxtLink>
      </div>
    </template>

    <ol
      class="divide-y divide-lp-border"
      aria-label="Global leaderboard standings"
    >
      <li
        v-for="entry in rows"
        :key="entry.rank"
        class="flex items-center gap-3 px-4 py-2.5 transition-colors"
        :class="entry.isCurrentUser ? 'bg-lp-accent/10' : ''"
        :aria-current="entry.isCurrentUser ? 'true' : undefined"
      >
        <!-- Rank: medal-ish chip for the podium, plain mono for the rest. -->
        <span
          v-if="isPodium(entry.rank)"
          class="inline-flex w-7 shrink-0 items-center justify-center gap-0.5 font-mono text-sm font-semibold"
          :class="PODIUM_COLORS[entry.rank]"
        >
          <Icon name="lucide:medal" :size="14" aria-hidden="true" />
          <span>{{ entry.rank }}</span>
        </span>
        <span
          v-else
          class="inline-flex w-7 shrink-0 justify-center font-mono text-sm text-lp-text-muted"
          aria-hidden="true"
        >
          {{ entry.rank }}
        </span>

        <LpAvatar :name="entry.name" size="sm" />

        <div class="min-w-0">
          <div class="flex items-center gap-1">
            <span class="truncate font-medium text-lp-text">{{ entry.name }}</span>
            <Icon
              v-if="entry.marker"
              :name="`lucide:${MARKERS[entry.marker].icon}`"
              :size="13"
              class="shrink-0"
              :class="MARKERS[entry.marker].color"
              role="img"
              :aria-label="MARKERS[entry.marker].label"
            />
          </div>
          <p class="font-mono text-xs text-lp-text-muted">
            Level {{ entry.level }}
          </p>
        </div>

        <!-- Points: gold LP coin dot + figure. -->
        <div class="ml-auto flex shrink-0 items-center gap-1.5">
          <span
            class="h-2.5 w-2.5 rounded-full bg-lp-gold-gradient shadow-glow-gold"
            aria-hidden="true"
          />
          <span class="font-mono text-sm text-lp-gold">
            {{ formatPoints(entry.points) }}
            <span class="sr-only">virtual points</span>
          </span>
        </div>
      </li>
    </ol>
  </LpCard>
</template>
