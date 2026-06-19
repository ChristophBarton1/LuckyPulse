<script setup lang="ts">
// Catch-all stub for routes not yet built (sports/esports hubs, rooms, leaderboard,
// rewards, profile areas...). Keeps every nav link graceful instead of 404, and is
// progressively replaced as each real page lands in later sub-projects.
definePageMeta({ layout: 'dashboard' })
const route = useRoute()
useHead({ title: 'Coming soon — LuckyPulse' })
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center px-6">
    <div class="w-full max-w-md">
      <LpEmptyState
        title="Coming soon"
        :description="`${route.path} is part of an upcoming build phase. The component library and Live Hub are live today.`"
        icon="hammer"
        action-label="Back to Live Hub"
        action-to="/live"
      />
    </div>
  </div>
</template>
