// Realtime event contract for prediction rooms. The simulated socket emits these; the
// room store reduces them into normalized state. Mirrors the eventual server WS payloads.
import type { ChatMessage, MarketStatus } from '~/types/domain'
import type { RoomActivityItem } from '~/composables/useRoom'

export type ConnectionState = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

export type RealtimeEvent =
  | { type: 'clock'; clock: string }
  | { type: 'score'; side: 'home' | 'away'; score: number; minute: string; text: string }
  | { type: 'winprob'; home: number; draw?: number }
  | { type: 'market_tick'; marketId: string; closesInLabel: string; status: MarketStatus }
  | { type: 'market_sentiment'; marketId: string; pcts: Record<string, number> }
  | { type: 'market_resolved'; marketId: string; resultOptionId: string }
  | { type: 'chat'; message: ChatMessage }
  | { type: 'leaderboard_delta'; name: string; delta: number }
  | { type: 'activity'; item: RoomActivityItem }
