import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ChatMessage,
  LeaderboardEntry,
  LiveEvent,
  PredictionMarket,
} from '~/types/domain'
import type { ConnectionState, RealtimeEvent } from '~/types/realtime'
import { createRoomSocket, type RoomSocket } from '~/utils/realtime/roomSocket'
import type { CompanionData, RoomActivityItem, RoomData } from '~/composables/useRoom'

const CHAT_CAP = 60
const ACTIVITY_CAP = 30
const REWARD_BASE = 250

/**
 * Realtime room store. `seed()` sets the initial (SSR-safe) snapshot; `connect()` wires
 * the simulated socket on the client and reduces its events into normalized state.
 *
 * Performance per the realtime spec: leaderboard point deltas are batched and the
 * visual re-sort is throttled to at most once per second; chat/activity lists are
 * capped; picks are optimistic. Subscriptions are torn down in `disconnect()`.
 */
export const useRoomStore = defineStore('room', () => {
  const connection = ref<ConnectionState>('idle')
  const event = ref<LiveEvent | null>(null)
  const markets = ref<PredictionMarket[]>([])
  const leaderboard = ref<LeaderboardEntry[]>([])
  const chat = ref<ChatMessage[]>([])
  const activity = ref<RoomActivityItem[]>([])
  const companion = ref<CompanionData | null>(null)
  const picks = ref<Record<string, string>>({})
  const walletPoints = ref(0)
  /** Set briefly when a pick resolves correctly, for a reward cue. */
  const lastReward = ref<{ marketId: string; points: number } | null>(null)

  // Non-reactive internals.
  let socket: RoomSocket | null = null
  let lbTimer: ReturnType<typeof setInterval> | null = null
  const pendingDeltas = new Map<string, number>()

  function seed(room: RoomData): void {
    event.value = { ...room.event }
    markets.value = room.markets.map((m) => ({ ...m, options: m.options.map((o) => ({ ...o })) }))
    leaderboard.value = room.leaderboard.map((e) => ({ ...e }))
    chat.value = room.chat.map((c) => ({ ...c }))
    activity.value = room.activity.map((a) => ({ ...a }))
    companion.value = room.companion ? { ...room.companion } : null
    walletPoints.value = room.walletPoints
    picks.value = {}
  }

  function flushLeaderboard(): void {
    if (pendingDeltas.size === 0) return
    for (const entry of leaderboard.value) {
      const delta = pendingDeltas.get(entry.name)
      if (delta) entry.points += delta
    }
    pendingDeltas.clear()
    leaderboard.value.sort((a, b) => b.points - a.points)
    leaderboard.value.forEach((e, i) => {
      e.rank = i + 1
    })
  }

  function pushCapped<T>(list: T[], item: T, cap: number): T[] {
    const next = [item, ...list]
    return next.length > cap ? next.slice(0, cap) : next
  }

  function applyEvent(e: RealtimeEvent): void {
    switch (e.type) {
      case 'clock':
        if (event.value) event.value.clock = e.clock
        break
      case 'score':
        if (event.value) {
          if (e.side === 'home') event.value.home.score = e.score
          else event.value.away.score = e.score
          activity.value = pushCapped(
            activity.value,
            { id: `sc-${e.minute}`, icon: 'goal', text: e.text, timeLabel: e.minute, tone: 'accent' },
            ACTIVITY_CAP,
          )
        }
        break
      case 'winprob':
        if (companion.value) {
          companion.value.winProbHome = e.home
          if (e.draw !== undefined) companion.value.drawProb = e.draw
        }
        break
      case 'market_tick': {
        const m = markets.value.find((x) => x.id === e.marketId)
        if (m) {
          m.closesInLabel = e.closesInLabel
          m.status = e.status
        }
        break
      }
      case 'market_sentiment': {
        const m = markets.value.find((x) => x.id === e.marketId)
        if (m) for (const o of m.options) if (e.pcts[o.id] !== undefined) o.pct = e.pcts[o.id]
        break
      }
      case 'market_resolved': {
        const m = markets.value.find((x) => x.id === e.marketId)
        if (!m) break
        m.status = 'resolved'
        m.resultOptionId = e.resultOptionId
        m.closesInLabel = undefined
        const won = picks.value[e.marketId] === e.resultOptionId
        const label = m.question
        if (won) {
          const reward = m.pointsMultiplier * REWARD_BASE
          walletPoints.value += reward
          lastReward.value = { marketId: e.marketId, points: reward }
          activity.value = pushCapped(
            activity.value,
            { id: `win-${e.marketId}`, icon: 'trophy', text: `You won ${reward.toLocaleString('en-US')} VP — ${label}`, timeLabel: 'now', tone: 'green' },
            ACTIVITY_CAP,
          )
        } else {
          activity.value = pushCapped(
            activity.value,
            { id: `res-${e.marketId}`, icon: 'flag', text: `Market resolved — ${label}`, timeLabel: 'now', tone: 'neutral' },
            ACTIVITY_CAP,
          )
        }
        break
      }
      case 'chat':
        chat.value = pushCapped(chat.value, e.message, CHAT_CAP)
        break
      case 'leaderboard_delta':
        pendingDeltas.set(e.name, (pendingDeltas.get(e.name) ?? 0) + e.delta)
        break
      case 'activity':
        activity.value = pushCapped(activity.value, e.item, ACTIVITY_CAP)
        break
    }
  }

  function connect(room: RoomData): void {
    if (typeof window === 'undefined') return
    if (socket) disconnect()
    // Throttle leaderboard re-sort to <= 1/s regardless of delta frequency.
    lbTimer = setInterval(flushLeaderboard, 1000)
    socket = createRoomSocket({
      room,
      onState: (s) => {
        connection.value = s
      },
      onEvent: applyEvent,
    })
    socket.connect()
  }

  function disconnect(): void {
    socket?.disconnect()
    socket = null
    if (lbTimer) clearInterval(lbTimer)
    lbTimer = null
    flushLeaderboard()
  }

  /** Optimistic pick — reflected instantly, before any server confirmation. */
  function pick(marketId: string, optionId: string): void {
    picks.value = { ...picks.value, [marketId]: optionId }
  }

  return {
    connection,
    event,
    markets,
    leaderboard,
    chat,
    activity,
    companion,
    picks,
    walletPoints,
    lastReward,
    seed,
    connect,
    disconnect,
    pick,
    // exposed for tests
    applyEvent,
    flushLeaderboard,
  }
})
