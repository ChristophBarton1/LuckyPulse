<script setup lang="ts">
/**
 * StartingSoonList — upcoming-events list card for the Live Hub.
 *
 * House pattern (mirrors LpButton / LiveStatsRail / TopPredictionRooms):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - prop-driven: every row arrives via `items` (no fetching / no mock data)
 *  - thin composition over <LpCard padding="none">: header + divided rows
 *  - each row is a literal <NuxtLink> (not resolveComponent) into the room
 *  - per-row sport theming via `:data-theme` so `lp-accent*` reskins itself
 *
 * Numbers go through ~/utils/format so display logic stays out of the template.
 */
import type { EventCategory, StartingSoonItem } from '~/types/domain'
import { formatCompact, formatPoints } from '~/utils/format'

withDefaults(
  defineProps<{
    /** Upcoming events rendered into the divided list. */
    items: StartingSoonItem[]
  }>(),
  {
    items: () => [],
  },
)

/** Lucide icon per event category (shared mapping with TopPredictionRooms). */
const CATEGORY_ICON: Record<EventCategory, string> = {
  football: 'goal',
  f1: 'car-front',
  tennis: 'circle-dot',
  basketball: 'dribbble',
  fight: 'swords',
  esports: 'gamepad-2',
}
</script>

<template>
  <LpCard padding="none" as="section" aria-labelledby="starting-soon-heading">
    <template #header>
      <header class="flex items-center justify-between gap-3 px-4 py-3">
        <h2
          id="starting-soon-heading"
          class="font-heading text-base font-semibold text-lp-text"
        >
          Starting Soon
        </h2>
        <NuxtLink
          to="/live"
          class="rounded-lp-sm text-xs text-lp-text-muted transition-colors hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        >
          View All
        </NuxtLink>
      </header>
    </template>

    <ul role="list" class="divide-y divide-lp-border">
      <li v-for="item in items" :key="item.id" role="listitem">
        <NuxtLink
          :to="'/rooms/' + item.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-lp-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        >
          <!-- Time block: start time + themed countdown pill -->
          <div :data-theme="item.theme" class="flex w-14 shrink-0 flex-col items-start gap-1">
            <span class="font-mono text-sm text-lp-text">{{ item.startTime }}</span>
            <span
              class="rounded-full bg-lp-accent/15 px-1.5 font-mono text-[11px] text-lp-accent"
            >
              {{ item.startsInLabel }}
            </span>
          </div>

          <!-- Themed category icon chip -->
          <div
            :data-theme="item.theme"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lp-md bg-lp-accent/15 text-lp-accent"
          >
            <Icon :name="`lucide:${CATEGORY_ICON[item.category]}`" :size="18" aria-hidden="true" />
          </div>

          <!-- Title + subtitle -->
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-lp-text">{{ item.title }}</p>
            <p class="truncate text-xs text-lp-text-muted">{{ item.subtitle }}</p>
          </div>

          <!-- Right rail: participants + virtual-points prize pool -->
          <div class="flex shrink-0 flex-col items-end gap-1">
            <span
              class="inline-flex items-center gap-1 font-mono text-xs text-lp-text-soft"
              :title="`${formatCompact(item.participants)} participants`"
            >
              <Icon name="lucide:users" :size="13" aria-hidden="true" />
              {{ formatCompact(item.participants) }}
            </span>
            <span
              class="inline-flex items-center gap-1 font-mono text-sm text-lp-gold"
              :title="`${formatPoints(item.prizePool)} LP prize pool`"
            >
              <span class="font-mono text-[11px] text-lp-gold/80">LP</span>
              {{ formatPoints(item.prizePool) }}
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </LpCard>
</template>
