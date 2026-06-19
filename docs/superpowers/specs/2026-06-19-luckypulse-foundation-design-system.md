# LuckyPulse — Design Spec

**Date:** 2026-06-19
**Status:** Approved (Sub-project A)

LuckyPulse is an automated realtime **Sports & Esports prediction and fan-engagement
platform**. It is **not** a betting platform: virtual points only, no real money, no
deposits/withdrawals/cash prizes. Safe vocabulary only (prediction, pick, virtual points,
reward, room, leaderboard, fan/community challenge). Design target: the premium dark
sports/esports/social-gaming dashboard in `Lucky.png` (deep navy/black, gold for
points/CTAs, purple + cyan for live/esports energy, green for positive, red only for
LIVE/alerts/errors).

The build also serves as a portfolio piece for a **Senior Frontend Web Developer** role at
Funstage GmbH (Vienna, social gaming). The job's tech stack — Nuxt (preferred), Vue 3,
Pinia, Tailwind, SCSS, GraphQL, WebSockets, REST, performance, testing, release/rollback —
is covered nearly 1:1 by this project.

## Locked decisions

- **Backend:** mocked but architected. Nitro server routes return mock data; a *simulated*
  WebSocket service; adapter/repository **interfaces** designed so a real Prisma/Postgres +
  GraphQL Yoga impl can drop in later. Zero infra to run/demo.
- **Depth strategy:** go deep on the 6 "wow" screens — `/live`, `/rooms/[roomId]`,
  `/esports`, `/dashboard/performance`, `/dashboard/feature-flags`, `/dashboard/design-system`.
  Scaffold the remaining routes as clean, consistent stubs.
- **Package manager:** npm (Node 24.14, npm 11.9 on the machine).
- **CSS:** Tailwind v3 via `@nuxtjs/tailwindcss` + SCSS design tokens.

## Project decomposition (build order)

Each sub-project is its own spec → plan → build → verify cycle.

| # | Sub-project | Contains |
|---|---|---|
| **A** | Foundation + Design System | Nuxt scaffold, token pipeline, all `Lp*` base UI, `/dashboard/design-system` |
| **B** | Domain core (mocked) | TS types/models, mock adapters, EventNormalizer, PredictionGenerator, RoomScheduler, ResultResolver, LeaderboardEngine, RewardEngine + Vitest |
| **C** | Public pages | `/live`, `/sports/*`, `/esports/*`, landing, pricing, legal |
| **D** | Realtime room | `/rooms/[roomId]`, simulated WS, Pinia stores, predictions/chat/leaderboard/activity |
| **E** | Rewards + profile + leaderboard | daily spin, profile, global leaderboard |
| **F** | Dashboards | performance, feature-flags, releases, moderation, analytics |
| **G** | Polish | E2E (Playwright), a11y, perf budgets, mobile, empty/error/loading states |

---

## Sub-project A — Foundation + Design System (THIS SPEC)

**Goal:** A booting Nuxt 3 app, a token pipeline that drives every component from the exact
LuckyPulse palette, the full custom `Lp*` base UI kit (no default-Tailwind look), and a
living `/dashboard/design-system` page that documents it.

### Stack & tooling

- Nuxt 3 latest, Vue 3, **TypeScript strict**
- Tailwind v3 (`@nuxtjs/tailwindcss`), `sass`
- `@pinia/nuxt` + `pinia-plugin-persistedstate`, `@vueuse/nuxt`
- `@nuxt/image`, `@nuxt/icon` (Lucide collection), `@nuxt/fonts` (self-hosted)
- `@nuxt/eslint` + Prettier
- Vitest + `@nuxt/test-utils` + `@vue/test-utils` + happy-dom

### Token pipeline (single source of truth)

- `assets/scss/tokens.scss` → `:root { --lp-* }` with the exact spec values (bg, bg-soft,
  surface, surface-2, surface-3, border, border-strong, gold, gold-strong, purple,
  purple-strong, cyan, blue, green, orange, red, text, text-muted, text-soft) + spacing,
  radius, shadow/glow, z-index tokens.
- `tailwind.config.ts` maps theme → `var(--lp-*)` so utilities resolve:
  `bg-lp-surface`, `text-lp-gold`, `border-lp-border`, `font-heading`, `font-body`,
  `font-mono`, `shadow-glow-*`, etc.
- **Sport/esport themes** via `data-theme="football|f1|tennis|basketball|fight|esports"`
  attribute overriding accent vars (`--lp-accent`, `--lp-accent-2`). Components stay
  generic; the theme swaps colors.
  - Football green/gold · F1 red/cyan · Tennis purple/green · Basketball orange/gold ·
    Fight red/gold · Esports purple/cyan/gold.
- Fonts: **Space Grotesk** (headings), **Inter** (body), **JetBrains Mono** (numbers/metrics).
- `assets/scss/animations.scss` + `utilities.scss`: glow/pulse keyframes, `prefers-reduced-motion`
  guard, reduced-glow-on-mobile helper.

### Project structure (created now, filled later)

```
/assets/scss/{tokens,animations,utilities}.scss
/components/{app,ui,layout,sports,esports,events,rooms,predictions,leaderboard,
            rewards,chat,dashboard,analytics,performance,feature-flags,moderation,charts}
/composables /stores /types /utils
/server/{api,graphql,services,jobs,adapters,repositories,utils}
/tests/{unit,component,e2e}
```

### Base UI components (all custom, typed, variant-driven, SSR-safe, a11y)

`LpButton, LpCard, LpBadge, LpMetricCard, LpAvatar, LpTabs, LpInput, LpSelect, LpModal,
LpSkeleton, LpProgress, LpTooltip, LpStatusDot, LpSegmentedControl, LpEmptyState,
LpErrorState`

Component conventions:
- `<script setup lang="ts">`, typed `defineProps`/`defineEmits`, `withDefaults`.
- Variant + size maps as plain typed objects (small `cn`/`tv` helper in `/utils`), no
  external UI lib.
- Real semantic elements (`<button>`, `<label>`, `<dialog>`/focus-trap for modal), visible
  focus rings, ARIA where needed.
- No `window`/`document` access during setup (SSR-safe); browser-only bits behind
  `onMounted` / `<ClientOnly>`.

### Showcase page

`/dashboard/design-system`: palette swatches, type scale, every component with every
variant/size/state, and the 6 sport/esport themes rendered live. Serves as living docs +
visual regression surface.

### Testing

Vitest configured; component tests for `LpButton`, `LpBadge`, `LpMetricCard` establish the
pattern later sub-projects copy (render, props→class, slot, a11y attrs, emit on click).

### Out of scope for A

Data models, adapters, real pages, stores, WebSockets, dashboards beyond the design-system
showcase. Those belong to sub-projects B–G.

### Acceptance criteria for A

1. `npm run dev` boots; `npm run build` succeeds with no type errors (strict).
2. Tailwind utilities resolve LuckyPulse tokens; `data-theme` swaps accents.
3. All 16 `Lp*` components implemented, typed, SSR-safe, accessible.
4. `/dashboard/design-system` renders all components + themes without layout shift.
5. `npm run test` green (the 3 seed component tests pass).
