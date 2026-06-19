<script setup lang="ts">
/**
 * DashboardSidebar — the LuckyPulse LIVE HUB left navigation rail.
 *
 * Follows the Lp* house pattern:
 *  - typed props via `withDefaults(defineProps<...>())`, nothing `any`
 *  - prop-driven only: nav + user are supplied by the page, no internal data
 *  - reuses LpCard / LpProgress base components, hand-rolls only the rail layout
 *  - literal <NuxtLink> for routes, active state derived from useRoute().path
 *
 * Bottom block: daily streak tracker, level/XP card, and a legal-safe notice
 * (virtual points only — never real-money wagering vocabulary).
 */
import { computed } from 'vue'
import { useRoute } from '#imports'
import { cn } from '~/utils/cn'
import { formatPoints } from '~/utils/format'
import type { NavItem, CurrentUser } from '~/types/domain'

const props = withDefaults(
  defineProps<{
    nav: NavItem[]
    user: CurrentUser
  }>(),
  {},
)

const route = useRoute()

/** Active when the current route path exactly matches the item destination. */
function isActive(to: string): boolean {
  return route.path === to
}

function navItemClasses(to: string): string {
  return cn(
    'group relative inline-flex h-10 items-center gap-3 rounded-lp-md px-3 text-sm font-medium',
    'transition-[background-color,color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    isActive(to)
      ? 'bg-lp-surface-2 text-lp-text'
      : 'text-lp-text-muted hover:bg-lp-surface-2 hover:text-lp-text',
  )
}

/** Seven streak slots; the first `dailyStreak` (capped at 7) read as completed. */
const STREAK_SLOTS = 7
const filledStreak = computed(() => Math.min(Math.max(props.user.dailyStreak, 0), STREAK_SLOTS))
const streakSlots = computed(() =>
  Array.from({ length: STREAK_SLOTS }, (_, i) => i < filledStreak.value),
)
</script>

<template>
  <aside
    class="flex h-full w-60 shrink-0 flex-col gap-1 border-r border-lp-border bg-lp-bg-soft p-3 font-body"
  >
    <nav role="navigation" aria-label="Sidebar" class="flex flex-col gap-1">
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :class="navItemClasses(item.to)"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <!-- Left accent bar for the active item. -->
        <span
          v-if="isActive(item.to)"
          aria-hidden="true"
          class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-lp-accent"
        />
        <Icon :name="`lucide:${item.icon}`" :size="18" aria-hidden="true" />
        <span class="truncate">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto rounded-full bg-lp-red/15 px-1.5 font-mono text-[11px] leading-5 text-lp-red"
        >{{ item.badge }}</span>
      </NuxtLink>
    </nav>

    <div class="mt-auto flex flex-col gap-3 pt-3">
      <!-- 1) Daily streak tracker. -->
      <LpCard padding="sm" :aria-label="`Daily streak: ${user.dailyStreak} days`">
        <div class="mb-3 flex items-center gap-2">
          <Icon name="lucide:flame" :size="16" class="text-lp-orange" aria-hidden="true" />
          <span class="text-sm font-medium text-lp-text">Daily Streak</span>
          <span class="ml-auto font-mono text-sm text-lp-text">{{ user.dailyStreak }} Days</span>
        </div>
        <div class="flex items-center justify-between" aria-hidden="true">
          <span
            v-for="(done, i) in streakSlots"
            :key="i"
            :class="cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-full',
              done
                ? 'bg-lp-gold-gradient text-lp-bg'
                : 'border border-lp-border text-lp-text-muted',
            )"
          >
            <Icon v-if="done" name="lucide:check" :size="13" aria-hidden="true" />
          </span>
        </div>
      </LpCard>

      <!-- 2) Level / XP progress. -->
      <LpCard padding="sm">
        <div class="mb-3 flex items-baseline gap-2">
          <span class="font-heading text-sm font-semibold text-lp-text">{{ user.levelTitle }}</span>
          <span class="ml-auto font-mono text-xs text-lp-text-muted">Level {{ user.level }}</span>
        </div>
        <LpProgress :value="user.xp" :max="user.xpToNext" variant="accent" size="sm" />
        <p class="mt-2 font-mono text-xs text-lp-text-muted">
          {{ formatPoints(user.xp) }} / {{ formatPoints(user.xpToNext) }} XP
        </p>
      </LpCard>

      <!-- 3) Legal-safe notice. -->
      <div
        class="flex items-center gap-2.5 rounded-lp-md border border-lp-border bg-lp-surface px-3 py-2"
        role="note"
      >
        <Icon name="lucide:shield-check" :size="16" class="shrink-0 text-lp-green" aria-hidden="true" />
        <div class="flex flex-col leading-tight">
          <span class="text-[11px] text-lp-text-muted">Virtual points only</span>
          <span class="text-[11px] text-lp-text-muted">No real-money betting</span>
        </div>
      </div>
    </div>
  </aside>
</template>
