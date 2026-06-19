<script setup lang="ts">
/**
 * DashboardTopbar — the LuckyPulse LIVE HUB app top bar (header).
 *
 * Follows the house Lp* pattern:
 *  - typed props via `withDefaults(defineProps<...>())`
 *  - reuses base kit (LpAvatar) instead of recreating UI
 *  - `cn()` to compose, no external UI lib
 *  - semantic <header> + role="navigation", visible focus rings, correct ARIA
 *  - SSR-safe: active route derives from `useRoute()`, no window/document in setup
 *
 * Prop-driven: all nav + user data is passed in by the page. No fetching, no mocks.
 * Legal-safe: virtual points only (VP/LP), never real-money vocabulary.
 */
import { computed } from 'vue'
import type { NavItem, CurrentUser } from '~/types/domain'
import { formatPoints } from '~/utils/format'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    /** Primary top-nav tabs. */
    nav: NavItem[]
    /** Signed-in user summary (points, name, presence). */
    user: CurrentUser
  }>(),
  {
    nav: () => [],
  },
)

defineEmits<{
  /** Open the "add virtual points" flow. */
  addPoints: []
  /** Open the notifications panel. */
  notifications: []
  /** Open the account / profile menu. */
  account: []
}>()

const route = useRoute()

/** Active when the path matches exactly, or is a sub-route (startsWith). */
function isActive(to: string): boolean {
  const current = route.path
  if (current === to) return true
  // Treat "/" as exact-only so it doesn't swallow every route.
  if (to === '/') return false
  return current.startsWith(`${to}/`)
}

const points = computed(() => formatPoints(props.user.virtualPoints))

const linkClasses = (active: boolean): string =>
  cn(
    'inline-flex items-center gap-2 h-9 px-3 rounded-lp-md text-sm font-medium whitespace-nowrap',
    'transition-[background-color,color,border-color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
    active
      ? 'bg-lp-surface-2 text-lp-text ring-1 ring-inset ring-lp-border-strong'
      : 'text-lp-text-muted hover:text-lp-text hover:bg-lp-surface/60',
  )

const iconBtnClasses = cn(
  'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
  'text-lp-text-soft bg-lp-surface-2 border border-lp-border',
  'transition-[background-color,color,border-color] duration-150',
  'hover:text-lp-text hover:bg-lp-surface-3',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg',
)
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-lp-border bg-lp-bg-soft px-4"
  >
    <!-- LEFT: brand wordmark -->
    <NuxtLink
      to="/"
      class="group inline-flex shrink-0 items-center gap-2.5 rounded-lp-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
      aria-label="LuckyPulse home"
    >
      <span
        class="inline-flex h-9 w-9 items-center justify-center rounded-lp-md bg-lp-gold-gradient text-lp-bg shadow-glow-gold transition-[filter] duration-150 group-hover:brightness-105"
      >
        <Icon name="lucide:activity" :size="20" aria-hidden="true" />
      </span>
      <span class="font-heading text-xl font-bold leading-none tracking-tight">
        <span class="text-lp-text">Lucky</span><span class="text-lp-gold">Pulse</span>
      </span>
    </NuxtLink>

    <!-- CENTER: primary tabs -->
    <nav
      class="hidden flex-1 items-center justify-center gap-1 md:flex"
      role="navigation"
      aria-label="Primary"
    >
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :aria-label="item.label"
        :class="linkClasses(isActive(item.to))"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <Icon :name="`lucide:${item.icon}`" :size="17" aria-hidden="true" />
        <span class="hidden lg:inline">{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-lp-accent/15 px-1 font-mono text-[10px] font-semibold text-lp-accent"
          :aria-label="`${item.badge} new`"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- RIGHT: points pill + actions + account -->
    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
      <!-- Virtual-points pill -->
      <div
        class="inline-flex h-10 items-center gap-2 rounded-full border border-lp-border bg-lp-surface-2 pl-1.5 pr-1.5 sm:pl-2 sm:pr-2"
        role="group"
        aria-label="Virtual points balance"
      >
        <span
          class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lp-gold-gradient font-mono text-[10px] font-bold text-lp-bg"
          aria-hidden="true"
        >
          LP
        </span>
        <span class="flex flex-col leading-none">
          <span class="font-mono text-sm font-semibold text-lp-text">{{ points }}</span>
          <span class="hidden text-[10px] font-medium text-lp-text-muted sm:inline">
            Virtual Points
          </span>
        </span>
        <button
          type="button"
          class="ml-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lp-surface-3 text-lp-gold transition-[background-color,color] duration-150 hover:bg-lp-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
          aria-label="Add virtual points"
          @click="$emit('addPoints')"
        >
          <Icon name="lucide:plus" :size="16" aria-hidden="true" />
        </button>
      </div>

      <!-- Notifications -->
      <button
        type="button"
        :class="iconBtnClasses"
        aria-label="Notifications"
        @click="$emit('notifications')"
      >
        <Icon name="lucide:bell" :size="18" aria-hidden="true" />
        <span
          class="absolute right-2 top-2 h-2 w-2 rounded-full bg-lp-purple ring-2 ring-lp-bg-soft"
          aria-hidden="true"
        />
      </button>

      <!-- Account -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full p-0.5 pr-1 transition-[background-color] duration-150 hover:bg-lp-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-lp-bg"
        :aria-label="`Account menu for ${user.name}`"
        @click="$emit('account')"
      >
        <LpAvatar :name="user.name" status="online" size="sm" />
        <Icon
          name="lucide:chevron-down"
          :size="16"
          class="text-lp-text-muted"
          aria-hidden="true"
        />
      </button>
    </div>
  </header>
</template>
