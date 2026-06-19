<script setup lang="ts">
// /rooms/[roomId] — realtime prediction room. The room store seeds from the (mock) room
// aggregate for SSR, then connects a simulated WebSocket on mount that drives the live
// clock, scores, market countdowns/resolution, sentiment, chat, leaderboard and activity.
// Esports rooms embed live video; sports rooms use the legal Watch Companion.
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { formatPoints, formatCompact } from '~/utils/format'
import { useRoomStore } from '~/stores/room'
import type { StreamInfo } from '~/types/domain'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const roomId = String(route.params.roomId)
const room = useRoom(roomId)

const store = useRoomStore()
store.seed(room) // synchronous + SSR-safe: deterministic initial state

const { event, markets, leaderboard, chat, activity, companion, connection, walletPoints } =
  storeToRefs(store)

// Non-null view of the event (falls back to the static seed before the store settles).
const ev = computed(() => event.value ?? room.event)

useHead({ title: `${room.event.home.name} vs ${room.event.away.name} — LuckyPulse` })

// Esports rooms only: discover embeddable live streams (real via Helix, fallback otherwise).
const { data: streamData } = await useFetch('/api/streams/live', {
  query: { category: room.streamCategory, first: 5 },
  immediate: room.kind === 'esports',
  default: () => ({ source: 'fallback', category: room.streamCategory, streams: [] as StreamInfo[] }),
})
const streams = computed<StreamInfo[]>(() => streamData.value?.streams ?? [])
const featured = computed(() => streams.value[0])
const others = computed(() => streams.value.slice(1, 5))

onMounted(() => store.connect(room))
onBeforeUnmount(() => store.disconnect())

function onPick(marketId: string, optionId: string): void {
  store.pick(marketId, optionId)
}

const CONN = computed(() => {
  switch (connection.value) {
    case 'open':
      return { label: 'Live', spin: false, live: true, tone: 'text-lp-red' }
    case 'connecting':
      return { label: 'Connecting…', spin: true, live: false, tone: 'text-lp-text-muted' }
    case 'reconnecting':
      return { label: 'Reconnecting…', spin: true, live: false, tone: 'text-lp-orange' }
    default:
      return { label: 'Offline', spin: false, live: false, tone: 'text-lp-text-muted' }
  }
})

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
        <TeamCrest :name="ev.home.name" size="sm" />
        <div class="min-w-0">
          <p class="truncate font-heading font-semibold text-lp-text">
            {{ ev.home.name }}
            <span class="font-mono text-lp-text-muted">{{ ev.home.score }}–{{ ev.away.score }}</span>
            {{ ev.away.name }}
          </p>
          <p class="truncate text-xs text-lp-text-muted">{{ ev.competition }} · {{ ev.stage }}</p>
        </div>
        <TeamCrest :name="ev.away.name" size="sm" />
      </div>

      <div class="ml-auto flex items-center gap-3">
        <!-- Connection / live indicator -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-surface-2 px-2.5 py-1 text-xs"
          role="status"
        >
          <Icon v-if="CONN.spin" name="lucide:loader-2" :size="12" class="animate-spin" :class="CONN.tone" aria-hidden="true" />
          <LpStatusDot v-else :status="CONN.live ? 'live' : 'offline'" />
          <span class="font-mono uppercase tracking-wide" :class="CONN.tone">{{ CONN.label }}</span>
        </span>
        <span class="hidden items-center gap-1.5 font-mono text-sm text-lp-text-muted sm:inline-flex">
          <Icon name="lucide:clock" :size="14" aria-hidden="true" /> {{ ev.clock }}
        </span>
        <span class="inline-flex items-center gap-1.5 text-sm text-lp-text-muted">
          <Icon name="lucide:users" :size="15" aria-hidden="true" />
          <span class="font-mono">{{ formatCompact(ev.watching) }}</span>
        </span>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
      <!-- Main: stream / companion + predictions -->
      <div class="flex min-w-0 flex-col gap-5">
        <WatchCompanionPanel
          v-if="room.kind === 'sports' && companion"
          :event="ev"
          :companion="companion"
          :broadcaster="room.broadcaster"
        />

        <section v-else class="flex flex-col gap-3">
          <StreamEmbed v-if="featured" :stream="featured" featured />
          <LpEmptyState
            v-else
            title="Watch Companion"
            description="No official stream is available — follow the live score, timeline and predictions here."
            icon="radio"
          />
          <div v-if="others.length" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StreamEmbed v-for="s in others" :key="s.channel ?? s.videoId" :stream="s" :live="false" />
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
            <span class="font-mono text-xs text-lp-text-muted">{{ markets.length }} markets</span>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PredictionMarketCard
              v-for="market in markets"
              :key="market.id"
              :market="market"
              :selected-option-id="store.picks[market.id] ?? null"
              @pick="onPick"
            />
          </div>
        </section>

        <!-- Leaderboard + Activity -->
        <section class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlobalLeaderboardPreview :entries="leaderboard" />
          <LpCard padding="none">
            <div class="border-b border-lp-border px-4 py-3">
              <h2 class="font-heading text-sm font-semibold text-lp-text">Room Activity</h2>
            </div>
            <ul class="divide-y divide-lp-border">
              <li v-for="item in activity" :key="item.id" class="flex items-center gap-3 px-4 py-2.5">
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
                <span class="font-mono text-2xl font-semibold text-lp-text">{{ formatPoints(walletPoints) }}</span>
              </p>
            </div>
            <LpButton variant="secondary" size="sm" icon="gift" to="/rewards">Daily bonus</LpButton>
          </div>
          <p class="mt-3 font-mono text-[11px] text-lp-text-muted">Virtual points only · No real-money betting.</p>
        </LpCard>

        <LiveChatPanel :messages="chat" :online="ev.watching" class="min-h-[420px] flex-1" />
      </aside>
    </div>
  </div>
</template>
