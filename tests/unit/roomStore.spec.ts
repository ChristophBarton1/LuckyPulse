import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRoomStore } from '~/stores/room'
import { useRoom } from '~/composables/useRoom'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useRoomStore', () => {
  it('seeds initial state from a room aggregate', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    expect(store.markets.length).toBeGreaterThan(0)
    expect(store.leaderboard.length).toBeGreaterThan(0)
    expect(store.walletPoints).toBeGreaterThan(0)
    expect(store.event?.home.name).toBe('Madrid')
  })

  it('records an optimistic pick immediately', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    store.pick('fm1', 'fm1a')
    expect(store.picks.fm1).toBe('fm1a')
  })

  it('awards virtual points when a pick resolves correctly', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    const before = store.walletPoints
    store.pick('fm1', 'fm1a')
    store.applyEvent({ type: 'market_resolved', marketId: 'fm1', resultOptionId: 'fm1a' })
    const market = store.markets.find((m) => m.id === 'fm1')
    expect(market?.status).toBe('resolved')
    expect(market?.resultOptionId).toBe('fm1a')
    expect(store.walletPoints).toBe(before + (market?.pointsMultiplier ?? 0) * 250)
    expect(store.lastReward?.marketId).toBe('fm1')
  })

  it('does not award when the pick is wrong', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    const before = store.walletPoints
    store.pick('fm3', 'fm3a')
    store.applyEvent({ type: 'market_resolved', marketId: 'fm3', resultOptionId: 'fm3b' })
    expect(store.walletPoints).toBe(before)
  })

  it('batches leaderboard deltas and re-sorts + re-ranks on flush', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    const last = store.leaderboard[store.leaderboard.length - 1]
    store.applyEvent({ type: 'leaderboard_delta', name: last.name, delta: 5_000_000 })
    // Not applied until flush.
    expect(store.leaderboard[0].name).not.toBe(last.name)
    store.flushLeaderboard()
    expect(store.leaderboard[0].name).toBe(last.name)
    expect(store.leaderboard.map((e) => e.rank)).toEqual(
      store.leaderboard.map((_, i) => i + 1),
    )
  })

  it('caps the chat list and keeps newest first', () => {
    const store = useRoomStore()
    store.seed(useRoom('r1'))
    for (let i = 0; i < 80; i++) {
      store.applyEvent({
        type: 'chat',
        message: { id: `t${i}`, author: 'Tester', text: `msg ${i}`, timeLabel: 'now', badge: null },
      })
    }
    expect(store.chat.length).toBeLessThanOrEqual(60)
    expect(store.chat[0].id).toBe('t79')
  })
})
