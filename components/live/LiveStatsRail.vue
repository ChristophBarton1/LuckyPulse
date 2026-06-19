<script setup lang="ts">
/**
 * LiveStatsRail — realtime KPI panel for the Live Hub.
 *
 * House pattern (mirrors LpButton / LpMetricCard):
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - prop-driven: all data arrives via `stats` (no fetching / no mock data)
 *  - thin composition: header row + a 2-col grid of <LpMetricCard>, which already
 *    formats numeric values and renders the icon chip + signed trend.
 *
 * NuxtLink is referenced as a literal tag (not resolveComponent).
 */
import type { LiveStat } from '~/types/domain'

withDefaults(
  defineProps<{
    /** Realtime KPIs rendered into the metric grid. */
    stats: LiveStat[]
  }>(),
  {
    stats: () => [],
  },
)
</script>

<template>
  <section aria-labelledby="live-stats-heading" class="flex flex-col gap-3">
    <!-- Header row: title + View All link -->
    <header class="flex items-center justify-between gap-3">
      <h2 id="live-stats-heading" class="font-heading text-base font-semibold text-lp-text">
        Live Stats
      </h2>
      <NuxtLink
        to="/analytics"
        class="rounded-lp-sm text-xs text-lp-text-muted transition-colors hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      >
        View All
      </NuxtLink>
    </header>

    <!-- KPI grid -->
    <div class="grid grid-cols-2 gap-3" role="list">
      <LpMetricCard
        v-for="s in stats"
        :key="s.key"
        role="listitem"
        :label="s.label"
        :value="s.value"
        :icon="s.icon"
        :accent="s.accent"
        :trend="s.trend"
      />
    </div>
  </section>
</template>
