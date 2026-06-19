<script setup lang="ts">
// /live — the Live Hub, the flagship product screen. Composes the prop-driven panels
// over the (mocked) hub data source. Realtime wiring (WebSocket store) replaces the
// static data in the realtime-room sub-project.
//
// Layout fills the viewport at every width: the container scales its max-width and
// spacing up through xl / 2xl so large monitors are used properly (not a narrow column
// marooned in the middle), and the content column stretches vertically to remove dead space.
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
  <div
    class="mx-auto flex min-h-full w-full max-w-[1480px] flex-col gap-5 px-4 py-5 xl:max-w-[1760px] xl:gap-6 xl:px-6 2xl:max-w-[2200px] 2xl:gap-7 2xl:px-8 2xl:py-7"
  >
    <div
      class="grid flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_408px] 2xl:gap-7"
    >
      <!-- Main column -->
      <div class="flex min-w-0 flex-col gap-5 xl:gap-6">
        <LiveHubHero :event="heroEvent" />
        <ExploreCategories :categories="categories" />
        <div class="grid flex-1 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          <TopPredictionRooms :rooms="predictionRooms" class="h-full" />
          <StartingSoonList :items="startingSoon" class="h-full" />
          <GlobalLeaderboardPreview :entries="leaderboard" class="h-full md:col-span-2 lg:col-span-1" />
        </div>
      </div>

      <!-- Right rail -->
      <aside class="flex flex-col gap-5 xl:gap-6">
        <LiveStatsRail :stats="liveStats" />
        <LiveChatPanel
          :messages="chatMessages"
          :online="heroEvent.watching"
          class="min-h-[380px] flex-1"
        />
        <DailySpinPreview :segments="spinSegments" :spins-left="1" resets-in-label="12:45:17" />
      </aside>
    </div>

    <p class="flex items-center justify-center gap-1.5 font-mono text-xs text-lp-text-muted">
      <Icon name="lucide:shield-check" :size="13" class="text-lp-green" />
      Virtual points only · No real-money betting
    </p>
  </div>
</template>
