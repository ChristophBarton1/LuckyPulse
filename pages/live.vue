<script setup lang="ts">
// /live — the Live Hub, the flagship product screen. Composes the prop-driven panels
// over the (mocked) hub data source. Realtime wiring (WebSocket store) replaces the
// static data in the realtime-room sub-project.
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Live Hub — LuckyPulse' })

const {
  heroEvent,
  liveStats,
  categories,
  predictionRooms,
  startingSoon,
  leaderboard,
  chatMessages,
  spinSegments,
} = useLiveHub()
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] px-4 py-5 xl:px-6">
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <!-- Main column -->
      <div class="min-w-0 space-y-5">
        <LiveHubHero :event="heroEvent" />
        <ExploreCategories :categories="categories" />
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <TopPredictionRooms :rooms="predictionRooms" />
          <StartingSoonList :items="startingSoon" />
          <GlobalLeaderboardPreview :entries="leaderboard" />
        </div>
      </div>

      <!-- Right rail -->
      <aside class="space-y-5">
        <LiveStatsRail :stats="liveStats" />
        <LiveChatPanel :messages="chatMessages" :online="heroEvent.watching" />
        <DailySpinPreview :segments="spinSegments" :spins-left="1" resets-in-label="12:45:17" />
      </aside>
    </div>

    <p class="mt-6 flex items-center justify-center gap-1.5 font-mono text-xs text-lp-text-muted">
      <Icon name="lucide:shield-check" :size="13" class="text-lp-green" />
      Virtual points only · No real-money betting
    </p>
  </div>
</template>
