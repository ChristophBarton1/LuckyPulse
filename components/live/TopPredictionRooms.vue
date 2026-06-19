<script setup lang="ts">
/**
 * TopPredictionRooms — ranked list card for the Live Hub.
 *
 * Follows the Lp* house pattern:
 *  - typed props via `withDefaults(defineProps<...>())`, sourced from '~/types/domain'
 *  - prop-driven, no internal data / fetching
 *  - reuses <LpCard> for the surface; rows are literal <NuxtLink>s
 *  - each row's category chip is theme-aware via `:data-theme` so `lp-accent*`
 *    reskins to the room's sport.
 */
import type { EventCategory, PredictionRoomSummary } from '~/types/domain'
import { formatCompact, formatPoints } from '~/utils/format'

withDefaults(
  defineProps<{
    rooms: PredictionRoomSummary[]
  }>(),
  {
    rooms: () => [],
  },
)

/** Lucide icon per category for the small themed category chip. */
const CATEGORY_ICONS: Record<EventCategory, string> = {
  football: 'goal',
  f1: 'car-front',
  tennis: 'circle-dot',
  basketball: 'dribbble',
  fight: 'swords',
  esports: 'gamepad-2',
}
</script>

<template>
  <LpCard padding="none" as="section" aria-label="Top prediction rooms">
    <div class="flex items-center justify-between px-4 py-3 border-b border-lp-border">
      <h2 class="font-heading font-semibold text-lp-text">Top Prediction Rooms</h2>
      <NuxtLink
        to="/live"
        class="inline-flex items-center gap-1 rounded-lp-sm text-xs font-medium text-lp-text-muted transition-colors hover:text-lp-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      >
        View All
        <Icon name="lucide:chevron-right" :size="14" aria-hidden="true" />
      </NuxtLink>
    </div>

    <ol class="flex flex-col">
      <li v-for="(room, index) in rooms" :key="room.id">
        <NuxtLink
          :to="'/rooms/' + room.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-lp-surface-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-inset',
            index < rooms.length - 1 ? 'border-b border-lp-border' : '',
          ]"
        >
          <!-- Rank chip — gold for the podium, muted otherwise. -->
          <span
            :class="[
              'h-7 w-7 shrink-0 rounded-lp-sm grid place-items-center font-mono text-sm',
              room.rank <= 3 ? 'bg-lp-gold/15 text-lp-gold' : 'bg-lp-surface-3 text-lp-text-muted',
            ]"
            aria-hidden="true"
          >
            {{ room.rank }}
          </span>

          <!-- Themed category icon chip — reskins via data-theme. -->
          <div :data-theme="room.theme" class="shrink-0 rounded-lp-sm bg-lp-accent/15 p-1.5">
            <Icon
              :name="`lucide:${CATEGORY_ICONS[room.category]}`"
              :size="16"
              class="text-lp-accent block"
              aria-hidden="true"
            />
          </div>

          <!-- Title + subtitle. -->
          <div class="min-w-0">
            <p class="font-medium text-lp-text truncate">{{ room.title }}</p>
            <p class="text-xs text-lp-text-muted truncate">{{ room.subtitle }}</p>
          </div>

          <!-- Participants + prize pool. -->
          <div class="ml-auto shrink-0 text-right">
            <span class="flex items-center justify-end gap-1 text-xs text-lp-text-muted">
              <Icon name="lucide:users" :size="12" aria-hidden="true" />
              <span class="font-mono">{{ formatCompact(room.participants) }}</span>
            </span>
            <span class="mt-0.5 flex items-center justify-end gap-1.5 font-mono text-sm text-lp-gold">
              <span class="h-1.5 w-1.5 rounded-full bg-lp-gold" aria-hidden="true" />
              {{ formatPoints(room.prizePool) }}
            </span>
          </div>
        </NuxtLink>
      </li>
    </ol>
  </LpCard>
</template>
