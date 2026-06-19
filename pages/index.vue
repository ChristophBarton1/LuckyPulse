<script setup lang="ts">
// Placeholder landing for sub-project A. The full SaaS landing page is built in
// sub-project C; for now it points into the living design system.
useHead({ title: 'LuckyPulse' })
</script>

<template>
  <main
    class="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center"
  >
    <p class="font-mono text-xs uppercase tracking-[0.3em] text-lp-accent">LuckyPulse</p>
    <h1 class="font-heading text-4xl font-bold leading-tight sm:text-5xl">
      Sports + Esports prediction rooms, <span class="lp-text-gold">automated</span>.
    </h1>
    <p class="max-w-xl text-lp-text-muted">
      Foundation &amp; design system scaffold is live. Explore the component library and
      sport/esport themes.
    </p>
    <NuxtLink
      to="/dashboard/design-system"
      class="rounded-lp-md bg-lp-gold-gradient px-5 py-3 font-semibold text-lp-bg shadow-glow-gold transition hover:brightness-105"
    >
      Open the design system →
    </NuxtLink>
    <p class="font-mono text-[11px] text-lp-text-muted">
      Virtual points only. No real-money betting.
    </p>
  </main>
</template>
