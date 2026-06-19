<script setup lang="ts">
/**
 * WatchCompanionPanel — the legal "second screen" for sports where we cannot embed the
 * licensed broadcast. Driven entirely by real live DATA (score, win probability, stats,
 * timeline) — never restreamed video. Offers a deep-link to the official rights-holder.
 *
 * Prop-driven; data arrives from the room aggregate (mock now, real sports API later).
 */
import { computed } from 'vue'
import { cn } from '~/utils/cn'
import type { Broadcaster, LiveEvent } from '~/types/domain'
import type { CompanionData } from '~/composables/useRoom'

const props = withDefaults(
  defineProps<{
    event: LiveEvent
    companion: CompanionData
    broadcaster?: Broadcaster
  }>(),
  { broadcaster: undefined },
)

const awayProb = computed(() =>
  Math.max(0, 100 - props.companion.winProbHome - (props.companion.drawProb ?? 0)),
)

const EVENT_ICON: Record<string, string> = {
  goal: 'goal',
  card: 'square',
  sub: 'repeat',
  chance: 'zap',
  kickoff: 'play',
  info: 'info',
}

function eventIconClass(type: string): string {
  return cn(
    'grid h-7 w-7 shrink-0 place-items-center rounded-full',
    type === 'goal' ? 'bg-lp-accent/15 text-lp-accent' : 'bg-lp-surface-3 text-lp-text-muted',
  )
}
</script>

<template>
  <LpCard variant="elevated" padding="none" class="overflow-hidden">
    <!-- Scoreboard -->
    <div class="relative border-b border-lp-border bg-lp-surface-gradient p-5">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <LpBadge variant="red" uppercase pulse dot>Live</LpBadge>
          <span class="text-sm text-lp-text-muted">{{ event.competition }} · {{ event.stage }}</span>
        </div>
        <span class="inline-flex items-center gap-1.5 font-mono text-sm text-lp-text">
          <Icon name="lucide:clock" :size="14" aria-hidden="true" />{{ event.clock }}
        </span>
      </div>

      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div class="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <TeamCrest :name="event.home.name" size="lg" />
          <span class="font-heading text-lg font-bold text-lp-text sm:text-xl">{{ event.home.name }}</span>
        </div>
        <div class="font-mono text-4xl font-bold text-lp-text">
          {{ event.home.score ?? 0 }}<span class="mx-1.5 text-lp-text-muted">–</span>{{ event.away.score ?? 0 }}
        </div>
        <div class="flex flex-col items-center gap-2 text-center sm:flex-row-reverse sm:text-right">
          <TeamCrest :name="event.away.name" size="lg" />
          <span class="font-heading text-lg font-bold text-lp-text sm:text-xl">{{ event.away.name }}</span>
        </div>
      </div>

      <!-- Companion-mode note + official deep-link -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lp-md border border-lp-border bg-lp-bg/40 px-3 py-2">
        <p class="flex items-center gap-1.5 text-xs text-lp-text-muted">
          <Icon name="lucide:radio" :size="13" aria-hidden="true" />
          Live Watch Companion — official broadcast is rights-protected.
        </p>
        <a
          v-if="broadcaster"
          :href="broadcaster.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-9 items-center gap-2 rounded-lp-md border border-lp-border-strong px-3 text-sm font-medium text-lp-text transition-colors hover:border-lp-accent hover:text-lp-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        >
          Watch live on {{ broadcaster.name }}
          <Icon name="lucide:external-link" :size="14" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- Win probability -->
    <div class="border-b border-lp-border p-5">
      <p class="mb-2 font-mono text-xs uppercase tracking-wide text-lp-text-muted">Win probability</p>
      <div class="flex h-2.5 overflow-hidden rounded-full bg-lp-surface-3">
        <div class="bg-lp-red" :style="{ width: `${companion.winProbHome}%` }" aria-hidden="true" />
        <div v-if="companion.drawProb" class="bg-lp-surface-2" :style="{ width: `${companion.drawProb}%` }" aria-hidden="true" />
        <div class="bg-lp-text-muted" :style="{ width: `${awayProb}%` }" aria-hidden="true" />
      </div>
      <div class="mt-2 flex items-center justify-between font-mono text-xs">
        <span class="text-lp-red">{{ event.home.name }} {{ companion.winProbHome }}%</span>
        <span v-if="companion.drawProb" class="text-lp-text-muted">Draw {{ companion.drawProb }}%</span>
        <span class="text-lp-text-soft">{{ event.away.name }} {{ awayProb }}%</span>
      </div>
    </div>

    <!-- Stats + Timeline -->
    <div class="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
      <!-- Head-to-head stats -->
      <div>
        <p class="mb-3 font-mono text-xs uppercase tracking-wide text-lp-text-muted">Match stats</p>
        <ul class="space-y-2.5">
          <li v-for="stat in companion.stats" :key="stat.label">
            <div class="mb-1 flex items-center justify-between font-mono text-xs text-lp-text">
              <span>{{ stat.home }}</span>
              <span class="text-lp-text-muted">{{ stat.label }}</span>
              <span>{{ stat.away }}</span>
            </div>
            <div v-if="stat.bar" class="flex h-1.5 overflow-hidden rounded-full bg-lp-surface-3" aria-hidden="true">
              <div class="bg-lp-accent" :style="{ width: `${stat.home}%` }" />
            </div>
          </li>
        </ul>
      </div>

      <!-- Timeline -->
      <div>
        <p class="mb-3 font-mono text-xs uppercase tracking-wide text-lp-text-muted">Timeline</p>
        <ul class="space-y-3">
          <li v-for="ev in companion.timeline" :key="ev.id" class="flex items-start gap-3">
            <span class="w-9 shrink-0 pt-1 text-right font-mono text-xs text-lp-text-muted">{{ ev.minute }}</span>
            <span :class="eventIconClass(ev.type)">
              <Icon :name="`lucide:${EVENT_ICON[ev.type] ?? 'info'}`" :size="14" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1 pt-1 text-sm text-lp-text-soft">{{ ev.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </LpCard>
</template>
