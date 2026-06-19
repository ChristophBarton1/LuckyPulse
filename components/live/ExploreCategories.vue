<script setup lang="ts">
/**
 * ExploreCategories — the "Explore What's Hot" category strip for the Live Hub.
 *
 * House pattern (mirrors LpButton / LiveStatsRail):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - prop-driven: every tile arrives via `categories` (no fetching / no mock data)
 *  - thin composition over the Lp* base kit (LpCard, LpStatusDot)
 *  - per-tile `data-theme` wrapper re-skins `lp-accent*` to each sport/esport
 *  - NuxtLink referenced as a literal tag (not resolveComponent)
 *
 * Each tile links to the sport hub (`/sports/<category>`) or the esports hub
 * (`/esports`) when the category is esports.
 */
import type { CategoryTile } from '~/types/domain'

withDefaults(
  defineProps<{
    /** Category tiles rendered into the strip. */
    categories: CategoryTile[]
  }>(),
  {
    categories: () => [],
  },
)

/** Destination for a tile: dedicated esports hub, otherwise the sport hub. */
function tileTo(cat: CategoryTile): string {
  return cat.category === 'esports' ? '/esports' : `/sports/${cat.category}`
}
</script>

<template>
  <section aria-labelledby="explore-categories-heading" class="flex flex-col gap-3">
    <!-- Header row: title + View All link -->
    <header class="flex items-center justify-between gap-3">
      <h2
        id="explore-categories-heading"
        class="font-heading text-lg font-semibold text-lp-text"
      >
        Explore What's Hot
      </h2>
      <NuxtLink
        to="/live"
        class="rounded-lp-sm text-xs text-lp-text-muted transition-colors hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      >
        View All
      </NuxtLink>
    </header>

    <!-- Tile grid -->
    <div
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      role="list"
    >
      <!-- Per-tile theme wrapper re-skins lp-accent* to the sport. -->
      <div
        v-for="cat in categories"
        :key="cat.category"
        :data-theme="cat.theme"
        role="listitem"
      >
        <LpCard
          interactive
          glow="accent"
          padding="sm"
          :to="tileTo(cat)"
          :aria-label="`${cat.label} — ${cat.roomCount} rooms`"
          class="flex h-full flex-col gap-2.5"
        >
          <!-- Media band: theme-accent gradient + large translucent icon -->
          <div
            class="relative flex h-20 items-center justify-center overflow-hidden rounded-lp-md bg-lp-accent-gradient"
          >
            <Icon
              :name="`lucide:${cat.icon}`"
              :size="34"
              class="text-lp-bg opacity-60"
              aria-hidden="true"
            />
          </div>

          <!-- Label -->
          <p class="font-heading font-semibold text-lp-text">
            {{ cat.label }}
          </p>

          <!-- Status row: live indicator + room count -->
          <div class="flex items-center justify-between gap-2">
            <span
              v-if="cat.live"
              class="inline-flex items-center gap-1.5"
            >
              <LpStatusDot status="live" />
              <span class="text-xs text-lp-green">Live Now</span>
            </span>
            <span v-else aria-hidden="true" />

            <span class="font-mono text-xs text-lp-text-muted">
              {{ cat.roomCount }} Rooms
            </span>
          </div>
        </LpCard>
      </div>
    </div>
  </section>
</template>
