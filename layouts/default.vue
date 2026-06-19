<script setup lang="ts">
// Base shell. The richer AppShell / PublicHeader / DashboardSidebar layouts arrive in
// later sub-projects; this guarantees correct background, font and text color everywhere.
</script>

<template>
  <div class="lp-scroll min-h-screen bg-lp-bg font-body text-lp-text antialiased">
    <slot />
  </div>
</template>
