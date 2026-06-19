<script setup lang="ts">
import { ref } from 'vue'
import { SPORT_THEMES, SPORT_THEME_LABELS, type SportTheme } from '~/types/theme'

useHead({ title: 'Design System — LuckyPulse' })

// The whole page is wrapped in `data-theme`, so the theme switcher live-reskins
// every accent-aware component (buttons, badges, progress, swatches...).
const theme = ref<SportTheme>('default')
const themeOptions = SPORT_THEMES.map((t) => ({ value: t, label: SPORT_THEME_LABELS[t] }))

// Interactive demo state.
const activeTab = ref('live')
const segment = ref('sports')
const category = ref('')
const sampleInput = ref('')
const modalOpen = ref(false)

const tabs = [
  { value: 'lobby', label: 'Lobby' },
  { value: 'live', label: 'Live Rooms', count: 158 },
  { value: 'leaderboard', label: 'Leaderboard' },
  { value: 'rewards', label: 'Rewards', icon: 'gift' },
]

const segments = [
  { value: 'sports', label: 'Sports', icon: 'trophy' },
  { value: 'esports', label: 'Esports', icon: 'gamepad-2' },
]

const categoryOptions = [
  { value: 'football', label: 'Football' },
  { value: 'f1', label: 'Formula 1' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'moba', label: 'MOBA Championship' },
]

const nav = [
  { id: 'foundations', label: 'Colors' },
  { id: 'type', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'cards', label: 'Cards' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'avatars', label: 'Avatars' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
]

const buttonVariants = ['primary', 'gold', 'accent', 'secondary', 'outline', 'ghost', 'danger', 'success'] as const
const badgeVariants = ['neutral', 'gold', 'purple', 'cyan', 'green', 'red', 'orange', 'accent', 'outline'] as const
</script>

<template>
  <div :data-theme="theme" class="min-h-screen pb-24">
    <!-- Sticky header + in-page nav -->
    <header
      class="sticky top-0 z-20 border-b border-lp-border bg-lp-bg/80 backdrop-blur-md"
    >
      <div class="mx-auto max-w-6xl px-6 py-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-lp-md bg-lp-gold-gradient text-lp-bg"
            >
              <Icon name="lucide:activity" :size="20" />
            </span>
            <div>
              <h1 class="font-heading text-lg font-bold leading-none text-lp-text">
                Design System
              </h1>
              <p class="mt-0.5 text-xs text-lp-text-muted">LuckyPulse component library</p>
            </div>
          </div>
          <LpBadge variant="green" uppercase dot>Virtual points only</LpBadge>
        </div>

        <nav class="lp-scroll -mb-px mt-4 flex gap-1 overflow-x-auto">
          <a
            v-for="item in nav"
            :key="item.id"
            :href="`#${item.id}`"
            class="whitespace-nowrap rounded-lp-sm px-3 py-1.5 text-sm text-lp-text-muted transition-colors hover:bg-lp-surface-2 hover:text-lp-text"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl space-y-14 px-6 py-10">
      <!-- Theme switcher -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 rounded-lp-xl border border-lp-border bg-lp-surface p-4"
      >
        <div>
          <p class="font-heading text-sm font-semibold text-lp-text">Live theme</p>
          <p class="text-xs text-lp-text-muted">
            Swaps the <code class="font-mono text-lp-accent">--lp-accent</code> tokens via
            <code class="font-mono text-lp-accent">data-theme</code> — every accent component re-skins.
          </p>
        </div>
        <div class="lp-scroll max-w-full overflow-x-auto">
          <LpSegmentedControl v-model="theme" :options="themeOptions" aria-label="Theme" />
        </div>
      </div>

      <!-- Colors -->
      <DsSection id="foundations" title="Colors" description="Token-driven palette. Everything maps to a CSS variable.">
        <div class="space-y-6">
          <div>
            <p class="mb-2 font-mono text-xs uppercase tracking-wide text-lp-text-muted">Surfaces</p>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <DsSwatch label="Background" token="--lp-bg" />
              <DsSwatch label="Background soft" token="--lp-bg-soft" />
              <DsSwatch label="Surface" token="--lp-surface" />
              <DsSwatch label="Surface 2" token="--lp-surface-2" />
              <DsSwatch label="Surface 3" token="--lp-surface-3" />
            </div>
          </div>
          <div>
            <p class="mb-2 font-mono text-xs uppercase tracking-wide text-lp-text-muted">Brand &amp; state</p>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <DsSwatch label="Gold" token="--lp-gold" light />
              <DsSwatch label="Gold strong" token="--lp-gold-strong" light />
              <DsSwatch label="Purple" token="--lp-purple" />
              <DsSwatch label="Cyan" token="--lp-cyan" light />
              <DsSwatch label="Blue" token="--lp-blue" />
              <DsSwatch label="Green" token="--lp-green" light />
              <DsSwatch label="Orange" token="--lp-orange" light />
              <DsSwatch label="Red" token="--lp-red" />
              <DsSwatch label="Accent (themed)" token="--lp-accent" light />
              <DsSwatch label="Accent 2 (themed)" token="--lp-accent-2" />
            </div>
          </div>
        </div>
      </DsSection>

      <!-- Typography -->
      <DsSection id="type" title="Typography" description="Space Grotesk headings · Inter body · JetBrains Mono numerics.">
        <div class="space-y-4 rounded-lp-xl border border-lp-border bg-lp-surface p-6">
          <p class="font-heading text-4xl font-bold text-lp-text">Champions Clash Finals</p>
          <p class="font-heading text-2xl font-semibold text-lp-text">Section heading</p>
          <p class="font-body text-base text-lp-text-soft">
            Body copy in Inter — clear, readable, premium. Predict the outcome and climb the leaderboard.
          </p>
          <p class="font-body text-sm text-lp-text-muted">Muted secondary text for hints and metadata.</p>
          <p class="font-mono text-2xl font-semibold text-lp-text">250,000 <span class="text-lp-gold">VP</span></p>
          <p class="font-mono text-xs uppercase tracking-[0.3em] text-lp-accent">Live now</p>
        </div>
      </DsSection>

      <!-- Buttons -->
      <DsSection id="buttons" title="Buttons" description="Variants, sizes, icons, loading and link modes.">
        <div class="space-y-6 rounded-lp-xl border border-lp-border bg-lp-surface p-6">
          <div class="flex flex-wrap items-center gap-3">
            <LpButton v-for="v in buttonVariants" :key="v" :variant="v">
              {{ v }}
            </LpButton>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <LpButton size="sm" icon="zap">Small</LpButton>
            <LpButton size="md" icon="play">Enter Room</LpButton>
            <LpButton size="lg" icon-right="arrow-right">Make a pick</LpButton>
            <LpButton variant="accent" icon="rotate-cw" loading>Spinning</LpButton>
            <LpButton variant="secondary" disabled>Disabled</LpButton>
            <LpButton variant="outline" to="/">Link button</LpButton>
            <LpButton variant="ghost" icon="settings" aria-label="Settings" />
          </div>
          <LpButton variant="primary" block icon="trophy">Block / full width</LpButton>
        </div>
      </DsSection>

      <!-- Badges & status -->
      <DsSection id="badges" title="Badges &amp; status" description="Status pills, live pulse, status dots.">
        <div class="space-y-5 rounded-lp-xl border border-lp-border bg-lp-surface p-6">
          <div class="flex flex-wrap items-center gap-2">
            <LpBadge v-for="v in badgeVariants" :key="v" :variant="v">{{ v }}</LpBadge>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <LpBadge variant="red" uppercase pulse dot>Live</LpBadge>
            <LpBadge variant="cyan" uppercase dot>Starting soon</LpBadge>
            <LpBadge variant="gold" icon="crown">Host</LpBadge>
            <LpBadge variant="purple" icon="star">VIP</LpBadge>
            <LpBadge variant="neutral" icon="users">8.9K online</LpBadge>
          </div>
          <div class="flex flex-wrap items-center gap-5">
            <LpStatusDot status="live" label="Live" />
            <LpStatusDot status="online" label="Online" />
            <LpStatusDot status="upcoming" label="Upcoming" />
            <LpStatusDot status="resolving" label="Resolving" />
            <LpStatusDot status="offline" label="Offline" />
            <LpStatusDot status="error" label="Error" />
          </div>
        </div>
      </DsSection>

      <!-- Cards -->
      <DsSection id="cards" title="Cards" description="Surface containers — variants, glow, interactive, header/footer.">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LpCard>
            <p class="font-heading font-semibold text-lp-text">Surface</p>
            <p class="mt-1 text-sm text-lp-text-muted">Default card on the base surface.</p>
          </LpCard>
          <LpCard variant="elevated" glow="accent">
            <p class="font-heading font-semibold text-lp-text">Elevated + glow</p>
            <p class="mt-1 text-sm text-lp-text-muted">Gradient surface with an accent glow.</p>
          </LpCard>
          <LpCard variant="outline" interactive>
            <p class="font-heading font-semibold text-lp-text">Interactive</p>
            <p class="mt-1 text-sm text-lp-text-muted">Hover to lift; keyboard focusable.</p>
          </LpCard>
          <LpCard variant="gradient" sheen class="sm:col-span-2 lg:col-span-3">
            <template #header>
              <p class="font-heading font-semibold text-lp-text">With header &amp; footer</p>
            </template>
            <p class="text-sm text-lp-text-muted">
              Cards accept named header/footer slots with dividers.
            </p>
            <template #footer>
              <div class="flex justify-end gap-2">
                <LpButton variant="ghost" size="sm">Dismiss</LpButton>
                <LpButton size="sm">Confirm</LpButton>
              </div>
            </template>
          </LpCard>
        </div>
      </DsSection>

      <!-- Metrics -->
      <DsSection id="metrics" title="Metric cards" description="Dashboard stat cards with trend chips.">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LpMetricCard label="Active Users" :value="24568" icon="users" accent="cyan" :trend="12.5" trend-label="vs last hour" />
          <LpMetricCard label="Live Rooms" :value="158" icon="radio" accent="purple" :trend="8.1" />
          <LpMetricCard label="Votes / Min" :value="3620" icon="trending-up" accent="green" :trend="13.2" />
          <LpMetricCard label="Points Distributed" value="1.2M" icon="coins" accent="gold" :trend="-2.4" trend-label="vs avg" />
        </div>
      </DsSection>

      <!-- Avatars -->
      <DsSection id="avatars" title="Avatars" description="Initials + deterministic gradient fallback (no copyrighted logos).">
        <div class="flex flex-wrap items-end gap-5 rounded-lp-xl border border-lp-border bg-lp-surface p-6">
          <LpAvatar name="Pulse King" size="lg" status="live" ring />
          <LpAvatar name="Nova Star" size="md" status="online" />
          <LpAvatar name="Bet Master" size="md" shape="rounded" status="busy" />
          <LpAvatar name="Ace Predictor" size="sm" />
          <LpAvatar name="Win Streak" size="xs" />
        </div>
      </DsSection>

      <!-- Forms -->
      <DsSection id="forms" title="Form controls" description="Inputs, select, segmented control, tabs.">
        <div class="grid gap-6 rounded-lp-xl border border-lp-border bg-lp-surface p-6 lg:grid-cols-2">
          <div class="space-y-4">
            <LpInput v-model="sampleInput" label="Display name" placeholder="PulseKing" icon="user" hint="Shown on the leaderboard." />
            <LpInput model-value="bad value" label="With error" error="That name is taken." icon="user" />
            <LpSelect v-model="category" :options="categoryOptions" label="Category" placeholder="Choose a category" />
          </div>
          <div class="space-y-5">
            <div>
              <p class="mb-2 text-sm text-lp-text-soft">Segmented control</p>
              <LpSegmentedControl v-model="segment" :options="segments" aria-label="Mode" />
            </div>
            <div>
              <p class="mb-2 text-sm text-lp-text-soft">Tabs</p>
              <LpTabs v-model="activeTab" :tabs="tabs" />
              <p class="mt-3 text-sm text-lp-text-muted">Active: <span class="font-mono text-lp-accent">{{ activeTab }}</span></p>
            </div>
          </div>
        </div>
      </DsSection>

      <!-- Feedback -->
      <DsSection id="feedback" title="Feedback &amp; overlays" description="Progress, skeletons, tooltip, modal, empty/error states.">
        <div class="space-y-6">
          <div class="grid gap-4 rounded-lp-xl border border-lp-border bg-lp-surface p-6 sm:grid-cols-2">
            <div class="space-y-3">
              <LpProgress :value="72" variant="accent" label="Room participation" show-label />
              <LpProgress :value="45" variant="gold" label="XP to next level" show-label />
              <LpProgress indeterminate variant="cyan" label="Resolving predictions…" />
            </div>
            <div class="space-y-3">
              <LpSkeleton variant="text" :lines="3" />
              <div class="flex items-center gap-3">
                <LpSkeleton variant="circle" width="2.5rem" />
                <LpSkeleton variant="rect" width="60%" height="1rem" />
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 rounded-lp-xl border border-lp-border bg-lp-surface p-6">
            <LpTooltip text="Virtual points only — no real money.">
              <LpButton variant="secondary" icon="info">Hover me</LpButton>
            </LpTooltip>
            <LpButton icon="layout-panel-top" @click="modalOpen = true">Open modal</LpButton>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lp-xl border border-lp-border bg-lp-surface">
              <LpEmptyState
                title="No live rooms yet"
                description="Rooms open automatically before each event. Check back soon."
                icon="radio"
                action-label="Browse upcoming"
                action-to="/"
              />
            </div>
            <div class="rounded-lp-xl border border-lp-border bg-lp-surface">
              <LpErrorState
                title="Couldn't load the leaderboard"
                description="The data adapter timed out."
              />
            </div>
          </div>
        </div>
      </DsSection>
    </main>

    <LpModal v-model="modalOpen" title="Confirm your pick" description="This uses virtual points only.">
      <p class="text-sm text-lp-text-soft">
        You're about to predict <strong class="text-lp-text">Home win</strong> for 500 virtual points.
        Picks lock when the market closes.
      </p>
      <template #footer>
        <LpButton variant="ghost" @click="modalOpen = false">Cancel</LpButton>
        <LpButton icon="check" @click="modalOpen = false">Confirm pick</LpButton>
      </template>
    </LpModal>
  </div>
</template>
