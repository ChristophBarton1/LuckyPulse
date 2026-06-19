<script setup lang="ts">
/**
 * LiveHubHero — the big featured live match hero for the LuckyPulse LIVE HUB.
 *
 * Follows the house Lp* pattern (see LpButton.vue / LpCard.vue):
 *  - typed props via `withDefaults(defineProps<...>())`, never `any`
 *  - prop-driven: every value arrives via `event`; no fetching, no mock data
 *  - reuses the Lp* base kit (LpCard / LpBadge / LpAvatar / LpButton)
 *  - token-only styling; numbers go through ~/utils/format
 *
 * The root <section> carries `:data-theme="event.theme"` so all `lp-accent*`
 * utilities below re-skin to the sport without conditional classes.
 */
import { computed } from 'vue'
import type { LiveEvent } from '~/types/domain'
import { formatPoints, formatCompact } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    event: LiveEvent
  }>(),
  {},
)

/** Score is always rendered, even when a side has no goals yet. */
const homeScore = computed(() => props.event.home.score ?? 0)
const awayScore = computed(() => props.event.away.score ?? 0)

/** Optional competition / stage line, joined only when stage exists. */
const competitionLine = computed(() =>
  props.event.stage
    ? `${props.event.competition} · ${props.event.stage}`
    : props.event.competition,
)

const roomTo = computed(() => `/rooms/${props.event.id}`)
</script>

<template>
  <section :data-theme="event.theme" class="font-body">
    <LpCard
      variant="elevated"
      padding="lg"
      class="relative min-h-[320px] overflow-hidden !rounded-lp-2xl"
      :aria-label="`Live match: ${event.home.name} versus ${event.away.name}`"
    >
      <!-- Faint radial accent glow behind the matchup. Decorative only. -->
      <div
        class="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-lp-accent/15 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative flex h-full flex-col gap-6">
        <!-- TOP ROW -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <LpBadge variant="red" uppercase pulse dot>Live Now</LpBadge>
            <span class="text-sm text-lp-text-muted">{{ competitionLine }}</span>
          </div>

          <div class="flex items-center gap-3">
            <span
              v-if="event.clock"
              class="rounded-lp-md bg-lp-surface-3 px-3 py-1 font-mono text-sm text-lp-text"
              :aria-label="`Match clock ${event.clock}`"
            >
              {{ event.clock }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-sm text-lp-text-muted">
              <Icon name="lucide:users" :size="15" aria-hidden="true" />
              <span class="font-mono">{{ formatCompact(event.watching) }}</span>
              <span class="sr-only">people watching</span>
            </span>
          </div>
        </div>

        <!-- CENTER MATCHUP -->
        <div
          class="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-4"
        >
          <!-- HOME -->
          <div class="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
            <LpAvatar :name="event.home.name" size="lg" ring />
            <div class="min-w-0">
              <h2 class="font-heading text-2xl font-bold text-lp-text sm:text-3xl">
                {{ event.home.name }}
              </h2>
              <ul
                v-if="event.home.goals?.length"
                class="mt-1 space-y-0.5 font-mono text-xs text-lp-text-muted"
              >
                <li v-for="(moment, i) in event.home.goals" :key="`home-${i}`">
                  {{ moment }}
                </li>
              </ul>
            </div>
          </div>

          <!-- SCORE -->
          <div
            class="order-first font-mono text-5xl font-bold text-lp-text sm:order-none"
            :aria-label="`Score ${homeScore} to ${awayScore}`"
          >
            <span>{{ homeScore }}</span>
            <span class="mx-2 text-lp-text-muted" aria-hidden="true">-</span>
            <span>{{ awayScore }}</span>
          </div>

          <!-- AWAY -->
          <div
            class="flex flex-col items-center gap-3 text-center sm:flex-row-reverse sm:gap-4 sm:text-right"
          >
            <LpAvatar :name="event.away.name" size="lg" ring />
            <div class="min-w-0">
              <h2 class="font-heading text-2xl font-bold text-lp-text sm:text-3xl">
                {{ event.away.name }}
              </h2>
              <ul
                v-if="event.away.goals?.length"
                class="mt-1 space-y-0.5 font-mono text-xs text-lp-text-muted"
              >
                <li v-for="(moment, i) in event.away.goals" :key="`away-${i}`">
                  {{ moment }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- PRIZE POOL -->
        <div class="flex flex-col items-center gap-1.5 text-center">
          <span class="font-mono text-xs uppercase tracking-wide text-lp-text-muted">
            Prize Pool
          </span>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lp-gold-gradient font-mono text-xs font-bold text-lp-bg shadow-glow-gold"
              aria-hidden="true"
            >
              LP
            </span>
            <span
              class="bg-lp-gold-gradient bg-clip-text font-mono text-2xl font-bold text-transparent"
            >
              {{ formatPoints(event.prizePool) }}
            </span>
            <span class="text-sm text-lp-text-muted">Virtual Points</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="mt-auto flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <LpButton variant="primary" icon="users" :to="roomTo">
            Join Room
          </LpButton>
          <LpButton variant="secondary" icon-right="chevron-right" :to="roomTo">
            View Details
          </LpButton>
        </div>
      </div>
    </LpCard>
  </section>
</template>
