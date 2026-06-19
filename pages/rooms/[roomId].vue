<script setup lang="ts">
// /rooms/[roomId] — the realtime prediction room. Streams live here: a featured embed
// autoplays (muted) and the rest play on hover. Predictions are optimistic (local pick
// state); the simulated-WebSocket store replaces the mock feed in a later step.
import { reactive, computed } from 'vue'
import { formatPoints, formatCompact } from '~/utils/format'
import type { StreamInfo } from '~/types/domain'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const roomId = String(route.params.roomId)
const room = useRoom(roomId)

useHead({ title: `${room.event.home.name} vs ${room.event.away.name} — LuckyPulse` })

// Discover embeddable live streams for this room's category (real via Twitch Helix when
// configured, curated fallback otherwise). SSR-fetched.
// Only esports rooms embed live video; sports rooms use the Watch Companion instead.
const { data: streamData } = await useFetch('/api/streams/live', {
  query: { category: room.streamCategory, first: 5 },
  immediate: room.kind === 'esports',
  default: () => ({ source: 'fallback', category: room.streamCategory, streams: [] as StreamInfo[] }),
})
const streams = computed<StreamInfo[]>(() => streamData.value?.streams ?? [])
const featured = computed(() => streams.value[0])
const others = computed(() => streams.value.slice(1, 5))

// Optimistic picks: marketId -> optionId.
const picks = reactive<Record<string, string>>({})
function onPick(marketId: string, optionId: string): void {
  picks[marketId] = optionId
}

const ACTIVITY_TONE: Record<string, string> = {
  neutral: 'text-lp-text-muted',
  accent: 'text-lp-accent',
  green: 'text-lp-green',
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] px-4 py-5 xl:max-w-[1900px] xl:px-6 2xl:max-w-[2200px]">
    <!-- Room header -->
    <header class="mb-5 flex flex-wrap items-center gap-4 rounded-lp-xl border border-lp-border bg-lp-surface px-4 py-3">
      <NuxtLink
        to="/live"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lp-md border border-lp-border text-lp-text-muted transition-colors hover:bg-lp-surface-2 hover:text-lp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        aria-label="Back to Live Hub"
      >
        <Icon name="lucide:arrow-left" :size="18" />
      </NuxtLink>

      <div class="flex min-w-0 items-center gap-3">
        <TeamCrest :name="room.event.home.name" size="sm" />
        <div class="min-w-0">
          <p class="truncate font-heading font-semibold text-lp-text">
            {{ room.event.home.name }}
            <span class="font-mono text-lp-text-muted">{{ room.event.home.score }}–{{ room.event.away.score }}</span>
            {{ room.event.away.name }}
          </p>
          <p class="truncate text-xs text-lp-text-muted">
            {{ room.event.competition }} · {{ room.event.stage }}
          </p>
        </div>
        <TeamCrest :name="room.event.away.name" size="sm" />
      </div>

      <div class="ml-auto flex items-center gap-3">
        <LpBadge variant="red" uppercase pulse dot>Live</LpBadge>
        <span class="hidden items-center gap-1.5 font-mono text-sm text-lp-text-muted sm:inline-flex">
          <Icon name="lucide:clock" :size="14" aria-hidden="true" /> {{ room.event.clock }}
        </span>
        <span class="inline-flex items-center gap-1.5 text-sm text-lp-text-muted">
          <Icon name="lucide:users" :size="15" aria-hidden="true" />
          <span class="font-mono">{{ formatCompact(room.event.watching) }}</span>
        </span>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
      <!-- Main: streams + predictions -->
      <div class="flex min-w-0 flex-col gap-5">
        <!-- Sports: legal Watch Companion (real data, no restream). -->
        <WatchCompanionPanel
          v-if="room.kind === 'sports' && room.companion"
          :event="room.event"
          :companion="room.companion"
          :broadcaster="room.broadcaster"
        />

        <!-- Esports: live Twitch/YouTube video. -->
        <section v-else class="flex flex-col gap-3">
          <StreamEmbed v-if="featured" :stream="featured" featured />
          <LpEmptyState
            v-else
            title="Watch Companion"
            description="No official stream is available for this event — follow the live score, timeline and predictions here."
            icon="radio"
          />
          <div v-if="others.length" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StreamEmbed
              v-for="s in others"
              :key="s.channel ?? s.videoId"
              :stream="s"
              :live="false"
            />
          </div>
          <p class="flex items-center gap-1.5 font-mono text-[11px] text-lp-text-muted">
            <Icon name="lucide:info" :size="12" aria-hidden="true" />
            Official Twitch/YouTube embeds. Top stream autoplays muted; hover the others to preview.
          </p>
        </section>

        <!-- Predictions -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-heading text-lg font-semibold text-lp-text">Live Predictions</h2>
            <span class="font-mono text-xs text-lp-text-muted">{{ room.markets.length }} markets</span>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PredictionMarketCard
              v-for="market in room.markets"
              :key="market.id"
              :market="market"
              :selected-option-id="picks[market.id] ?? null"
              @pick="onPick"
            />
          </div>
        </section>

        <!-- Leaderboard + Activity -->
        <section class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlobalLeaderboardPreview :entries="room.leaderboard" />
          <LpCard padding="none">
            <div class="border-b border-lp-border px-4 py-3">
              <h2 class="font-heading text-sm font-semibold text-lp-text">Room Activity</h2>
            </div>
            <ul class="divide-y divide-lp-border">
              <li v-for="item in room.activity" :key="item.id" class="flex items-center gap-3 px-4 py-2.5">
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-lp-sm bg-lp-surface-3" :class="ACTIVITY_TONE[item.tone]">
                  <Icon :name="`lucide:${item.icon}`" :size="14" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1 truncate text-sm text-lp-text-soft">{{ item.text }}</span>
                <span class="shrink-0 font-mono text-[11px] text-lp-text-muted">{{ item.timeLabel }}</span>
              </li>
            </ul>
          </LpCard>
        </section>
      </div>

      <!-- Right rail: wallet + chat -->
      <aside class="flex flex-col gap-5">
        <LpCard variant="elevated" glow="accent">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-mono text-xs uppercase tracking-wide text-lp-text-muted">Your wallet</p>
              <p class="mt-1 flex items-center gap-2">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-lp-red-gradient font-mono text-[10px] font-bold text-white">LP</span>
                <span class="font-mono text-2xl font-semibold text-lp-text">{{ formatPoints(room.walletPoints) }}</span>
              </p>
            </div>
            <LpButton variant="secondary" size="sm" icon="gift" to="/rewards">Daily bonus</LpButton>
          </div>
          <p class="mt-3 font-mono text-[11px] text-lp-text-muted">Virtual points only · No real-money betting.</p>
        </LpCard>

        <LiveChatPanel :messages="room.chat" :online="room.event.watching" class="min-h-[420px] flex-1" />
      </aside>
    </div>
  </div>
</template>
