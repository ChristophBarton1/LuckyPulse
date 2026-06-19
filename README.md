# LuckyPulse

**Automated realtime sports & esports prediction rooms — virtual points only, no real-money betting.**

LuckyPulse is a production-grade **Nuxt 3** platform where fans join live prediction rooms for
real sports and esports events, make picks with virtual points, watch official live streams (esports)
or a legal data-driven **Watch Companion** (sports), and climb realtime leaderboards. It was built to
demonstrate senior-level frontend engineering across the full Nuxt ecosystem.

<p>
  <img alt="Nuxt 3" src="https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxtdotjs&logoColor=white">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-store-ffd859?logo=pinia&logoColor=black">
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-28%20passing-6E9F18?logo=vitest&logoColor=white">
</p>

> ⚖️ **Virtual points only. No real-money betting.** No deposits, withdrawals, cash prizes, odds or
> stakes. Streams are official Twitch/YouTube embeds only; licensed sports broadcasts are never
> restreamed — sports use a live-data Watch Companion plus a deep-link to the official rights-holder.

---

## Screenshots

| Live Hub (start page) | Esports room — live Twitch |
| --- | --- |
| ![Live Hub](docs/screenshots/live-hub.png) | ![Esports room](docs/screenshots/room-esports-stream.png) |

| Sports room — Watch Companion | Design system |
| --- | --- |
| ![Watch Companion](docs/screenshots/watch-companion.png) | ![Design system](docs/screenshots/design-system.png) |

---

## Engineering highlights

- **Token-driven design system.** A single SCSS token layer feeds the Tailwind theme, so the entire
  app re-skins from one source. A `data-theme` attribute swaps sport/esport accents without
  conditional classes. 16 custom, accessible, SSR-safe `Lp*` base components, documented on a living
  `/dashboard/design-system` page.
- **Realtime engine.** A simulated WebSocket emits a typed event stream (clock, scores, market
  countdowns + resolution, sentiment drift, chat, leaderboard deltas) into a **Pinia store** that
  batches updates, **throttles the leaderboard re-sort to ≤1/s**, keeps optimistic picks, awards
  virtual points on correct resolution, and tears subscriptions down on route leave — with an
  exponential-backoff reconnect lifecycle.
- **Legal live-stream strategy.** Esports rooms embed **real live Twitch channels**, auto-discovered
  server-side via the Twitch Helix API (secret stays in Nitro, never on the client; curated fallback
  when unconfigured). Sports — whose broadcasts can't be legally embedded — get a **Watch Companion**:
  live score, win-probability, head-to-head stats and a match timeline, plus a deep-link to the
  official broadcaster. The `StreamEmbed` lazy-loads via `IntersectionObserver`: the featured player
  autoplays muted, the rest play on hover.
- **Performance-minded.** SSR public pages, lazy media, skeleton states, capped/virtualizable lists,
  `prefers-reduced-motion`, reduced glow on mobile, and a layout that scales and fills from laptop to
  ultrawide (verified at 1920 and 2560).
- **Typed + tested.** Strict TypeScript end-to-end, **28 unit/component tests** (Vitest + Vue Test
  Utils), clean production build.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Nuxt 3, Vue 3 `<script setup>`, TypeScript (strict) |
| State | Pinia (normalized realtime room store) |
| Styling | Tailwind CSS v3 + SCSS design tokens |
| Backend (MVP) | Nitro server routes (REST), mocked-but-architected adapters |
| Realtime | Simulated WebSocket service (swappable for a real WS) |
| Integrations | Twitch Helix (live streams), Watch Companion data adapters |
| Tooling | Vitest, Vue Test Utils, ESLint, Prettier, `@nuxt/fonts`, `@nuxt/icon` |

## Features

- **Live Hub** (`/live`) — featured live match hero, category tiles that open live rooms, top
  prediction rooms, starting-soon, global leaderboard, live chat, daily-spin preview, realtime stats.
- **Prediction rooms** (`/rooms/[id]`) — esports rooms with live Twitch video; sports rooms with the
  Watch Companion. Interactive prediction markets with optimistic picks, live countdowns and
  resolution, virtual-points wallet, leaderboard, chat and activity feed.
- **Categories** — Football, Formula 1, Tennis, Fight Sports, and a first-class Esports section.
- **Design system** (`/dashboard/design-system`) — the full component library with live theme switching.

## Getting started

**Prerequisites:** Node 20+ and npm.

```bash
npm install
cp .env.example .env   # optional — see below
npm run dev            # http://localhost:3000
```

The app runs fully without any keys (mock data + a curated stream fallback). To enable **real live
Twitch discovery**, create a free [Twitch developer app](https://dev.twitch.tv/console) (Client Type:
*Confidential*) and add to `.env`:

```dotenv
NUXT_TWITCH_CLIENT_ID=your_client_id
NUXT_TWITCH_CLIENT_SECRET=your_client_secret
# optional: real sports scores for the Watch Companion
NUXT_SPORT_API_KEY=your_sport_api_key
```

Secrets are read server-side via `runtimeConfig` and never exposed to the client. `.env` is gitignored.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build (Nitro) |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Strict type-check (`vue-tsc`) |
| `npm run test` | Run the test suite (Vitest) |
| `npm run lint` | ESLint |

## Project structure

```
assets/scss/        design tokens, animations, utilities
components/          ui (Lp* kit) · layout · live · rooms · predictions · events · chat · dashboard
composables/         useLiveHub, useRoom (mock data sources, adapter-shaped)
stores/              room.ts (Pinia realtime store)
server/api/          REST routes (e.g. /api/streams/live)
server/utils/        Twitch Helix helper (server-only)
utils/realtime/      simulated WebSocket service
types/               domain + realtime types
tests/               unit + component
```

## Testing

```bash
npm run test
```

Covers the design-system component contracts (`LpButton`, `LpBadge`, `LpMetricCard`) and the realtime
store logic (seed, optimistic picks, reward-on-resolve, leaderboard batching/throttle, chat capping).

## Status & roadmap

**Built:** design system, Live Hub, prediction rooms (esports streams + sports companion across 4
sports), realtime engine, legal stream strategy with live Twitch integration, 28 tests.

**Mocked / next:** real sports data API behind the companion, sports/esports hub pages, performance &
feature-flag dashboards, daily-spin/rewards, moderation tools, Playwright E2E, public deployment.

## Legal

This is a fan-engagement and prediction product using **virtual points only**. It is not a betting or
gambling platform: no real money, deposits, withdrawals, cash prizes, odds or stakes. Live video uses
official platform embeds (Twitch/YouTube); licensed sports broadcasts are not restreamed. Users must
follow local laws and platform terms. This README is not legal advice.
