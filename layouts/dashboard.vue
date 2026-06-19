<script setup lang="ts">
// App shell for the product dashboard: full-width topbar, left sidebar, scrollable main.
// User + nav come from the (mocked) Live Hub source for now; this swaps to the auth
// store + server data later without touching consumers.
const { user, primaryNav, topNav } = useLiveHub()
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-lp-bg font-body text-lp-text antialiased">
    <DashboardTopbar :nav="topNav" :user="user" />
    <div class="flex min-h-0 flex-1">
      <DashboardSidebar :nav="primaryNav" :user="user" class="hidden lg:flex" />
      <main class="lp-scroll min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
