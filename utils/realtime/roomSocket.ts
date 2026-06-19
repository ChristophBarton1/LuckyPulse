import type { ConnectionState, RealtimeEvent } from '~/types/realtime'
import type { RoomData } from '~/composables/useRoom'

/**
 * Simulated WebSocket for a prediction room (MVP stand-in for a real server socket).
 *
 * Emits the same typed RealtimeEvent stream a real WS would, drives a believable live
 * match (clock, score, market countdowns + resolution, sentiment drift, chat,
 * leaderboard deltas, activity), and models connection lifecycle with an
 * exponential-backoff reconnect. Client-only; all timers are cleaned up on disconnect.
 *
 * The interface (connect/disconnect + onEvent/onState) matches a real socket, so it can
 * be swapped for a Nitro/crossws WebSocket later without touching the store.
 */

export interface RoomSocket {
  connect(): void
  disconnect(): void
}

interface RoomSocketOptions {
  room: RoomData
  onEvent: (event: RealtimeEvent) => void
  onState: (state: ConnectionState) => void
}

const CHAT_POOL: { author: string; text: string; badge: 'vip' | 'verified' | 'host' | null }[] = [
  { author: 'PredictKing', text: 'called it 🔮', badge: 'vip' },
  { author: 'StatWizard', text: 'momentum shifting, watch the next play', badge: 'verified' },
  { author: 'NovaStar', text: "let's gooo 🔥", badge: null },
  { author: 'ClutchMaster', text: 'locking my pick now', badge: null },
  { author: 'FootyQueen', text: 'this is going the distance', badge: null },
  { author: 'AceShotcaller', text: 'objective control is everything rn', badge: null },
]

function parseCountdown(label: string): number {
  const [m, s] = label.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
}

function formatCountdown(total: number): string {
  const t = Math.max(0, total)
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

function tickClock(clock: string): string {
  const mmss = /^(\d+):(\d+)$/.exec(clock)
  if (mmss) {
    const total = Number(mmss[1]) * 60 + Number(mmss[2]) + 1
    return formatCountdown(total)
  }
  const min = /^(\d+)'?$/.exec(clock)
  if (min) return `${Number(min[1]) + 1}'`
  return clock
}

/** Pick a winning option id, biased toward the higher community share. */
function weightedWinner(options: { id: string; pct?: number }[]): string {
  const total = options.reduce((sum, o) => sum + (o.pct ?? 1), 0)
  let r = Math.random() * total
  for (const o of options) {
    r -= o.pct ?? 1
    if (r <= 0) return o.id
  }
  return options[0]?.id ?? ''
}

export function createRoomSocket(opts: RoomSocketOptions): RoomSocket {
  const { room, onEvent, onState } = opts

  // Mutable working copies the simulator evolves.
  let clock = room.event.clock ?? "0'"
  let winHome = room.companion?.winProbHome ?? 50
  const countdowns = new Map<string, number>()
  const resolved = new Set<string>()
  for (const m of room.markets) {
    if (m.closesInLabel) countdowns.set(m.id, parseCountdown(m.closesInLabel))
    if (m.status === 'resolved') resolved.add(m.id)
  }

  let timers: ReturnType<typeof setInterval>[] = []
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let chatIdx = 0
  let reconnectAttempts = 0

  function clearEmitters(): void {
    timers.forEach(clearInterval)
    timers = []
  }

  function startEmitters(): void {
    // Match clock.
    timers.push(
      setInterval(() => {
        clock = tickClock(clock)
        onEvent({ type: 'clock', clock })
      }, 2000),
    )

    // Market countdowns + resolution.
    timers.push(
      setInterval(() => {
        for (const m of room.markets) {
          if (resolved.has(m.id) || !countdowns.has(m.id)) continue
          const next = (countdowns.get(m.id) ?? 0) - 1
          countdowns.set(m.id, next)
          if (next <= 0) {
            resolved.add(m.id)
            const winner = weightedWinner(m.options)
            onEvent({ type: 'market_resolved', marketId: m.id, resultOptionId: winner })
          } else {
            onEvent({
              type: 'market_tick',
              marketId: m.id,
              closesInLabel: formatCountdown(next),
              status: next <= 15 ? 'closing' : 'open',
            })
          }
        }
      }, 1000),
    )

    // Sentiment drift on an open market.
    timers.push(
      setInterval(() => {
        const open = room.markets.filter((m) => !resolved.has(m.id))
        const m = open[Math.floor(Math.random() * open.length)]
        if (!m || m.options.length < 2) return
        const shift = Math.floor(Math.random() * 5) + 1
        const a = m.options[0]
        const b = m.options[1]
        const pa = Math.min(92, Math.max(8, (a.pct ?? 50) + (Math.random() > 0.5 ? shift : -shift)))
        const pcts: Record<string, number> = { [a.id]: pa, [b.id]: 100 - pa }
        if (m.options[2]) {
          // keep three-way roughly normalized
          pcts[a.id] = Math.max(5, pa - 8)
          pcts[b.id] = Math.max(5, 100 - pa - 8)
          pcts[m.options[2].id] = 100 - pcts[a.id] - pcts[b.id]
        }
        onEvent({ type: 'market_sentiment', marketId: m.id, pcts })
      }, 3200),
    )

    // Win-probability drift (sports companion).
    if (room.companion) {
      timers.push(
        setInterval(() => {
          winHome = Math.min(88, Math.max(40, winHome + (Math.random() > 0.5 ? 2 : -2)))
          onEvent({ type: 'winprob', home: winHome, draw: room.companion?.drawProb })
        }, 4500),
      )
    }

    // Chat.
    timers.push(
      setInterval(
        () => {
          const c = CHAT_POOL[chatIdx % CHAT_POOL.length]
          chatIdx += 1
          onEvent({
            type: 'chat',
            message: {
              id: `rt-${chatIdx}-${clock}`,
              author: c.author,
              text: c.text,
              timeLabel: 'now',
              votes: Math.floor(Math.random() * 400) + 20,
              badge: c.badge,
            },
          })
        },
        3500 + Math.floor(Math.random() * 2500),
      ),
    )

    // Leaderboard point deltas (store throttles the visual update).
    timers.push(
      setInterval(() => {
        const e = room.leaderboard[Math.floor(Math.random() * room.leaderboard.length)]
        if (e) onEvent({ type: 'leaderboard_delta', name: e.name, delta: Math.floor(Math.random() * 400) + 50 })
      }, 1500),
    )

    // Periodic brief reconnect to exercise the connection states.
    scheduleReconnect()
  }

  function scheduleReconnect(): void {
    reconnectTimer = setTimeout(() => {
      onState('reconnecting')
      clearEmitters()
      reconnectAttempts += 1
      // Exponential backoff, capped.
      const backoff = Math.min(1000 * 2 ** reconnectAttempts, 8000)
      reconnectTimer = setTimeout(() => {
        reconnectAttempts = 0
        onState('open')
        startEmitters()
      }, backoff)
    }, 45_000)
  }

  return {
    connect() {
      if (typeof window === 'undefined') return
      onState('connecting')
      setTimeout(() => {
        onState('open')
        startEmitters()
      }, 600)
    },
    disconnect() {
      clearEmitters()
      if (reconnectTimer) clearTimeout(reconnectTimer)
      reconnectTimer = null
      onState('closed')
    },
  }
}
