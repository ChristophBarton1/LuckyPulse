import type {
  ChatMessage,
  EventCategory,
  LeaderboardEntry,
  LiveEvent,
  PredictionMarket,
} from '~/types/domain'
import type { SportTheme } from '~/types/theme'

export interface RoomActivityItem {
  id: string
  icon: string
  text: string
  timeLabel: string
  tone: 'neutral' | 'accent' | 'green'
}

export interface RoomData {
  id: string
  event: LiveEvent
  /** Category used to discover embeddable Twitch streams for this room. */
  streamCategory: EventCategory | 'moba' | 'tactical-shooter' | 'battle-royale'
  theme: SportTheme
  markets: PredictionMarket[]
  leaderboard: LeaderboardEntry[]
  chat: ChatMessage[]
  activity: RoomActivityItem[]
  walletPoints: number
}

/**
 * Mocked room data source. Shaped like the eventual room aggregate (event + markets +
 * leaderboard + chat + activity), so the realtime WebSocket store can replace it
 * without changing the page. Default demo room is an esports MOBA match so the live
 * Twitch embeds apply.
 */
export function useRoom(_roomId: string): RoomData {
  const event: LiveEvent = {
    id: 'r3',
    type: 'esports',
    category: 'esports',
    theme: 'esports',
    competition: 'MOBA Championship',
    stage: 'Grand Final · Game 3',
    status: 'live',
    clock: '32:40',
    home: { name: 'Shadow Wolves', shortName: 'SW', score: 1 },
    away: { name: 'Crimson Apex', shortName: 'CA', score: 1 },
    prizePool: 125_000,
    watching: 12_480,
  }

  const markets: PredictionMarket[] = [
    {
      id: 'm1',
      question: 'Match winner',
      marketType: 'MATCH_WINNER',
      status: 'open',
      closesInLabel: '1:20',
      pointsMultiplier: 2,
      riskLevel: 'medium',
      options: [
        { id: 'm1a', label: 'Shadow Wolves', pct: 58 },
        { id: 'm1b', label: 'Crimson Apex', pct: 42 },
      ],
    },
    {
      id: 'm2',
      question: 'First objective (Game 3)',
      marketType: 'ESPORT_FIRST_OBJECTIVE',
      status: 'open',
      closesInLabel: '0:45',
      pointsMultiplier: 3,
      riskLevel: 'high',
      options: [
        { id: 'm2a', label: 'Shadow Wolves', pct: 51 },
        { id: 'm2b', label: 'Crimson Apex', pct: 49 },
      ],
    },
    {
      id: 'm3',
      question: 'Total maps over/under 4.5',
      marketType: 'OVER_UNDER',
      status: 'closing',
      closesInLabel: '0:08',
      pointsMultiplier: 2,
      riskLevel: 'low',
      options: [
        { id: 'm3a', label: 'Over 4.5', pct: 64 },
        { id: 'm3b', label: 'Under 4.5', pct: 36 },
      ],
    },
    {
      id: 'm4',
      question: 'First blood',
      marketType: 'ESPORT_FIRST_BLOOD',
      status: 'resolved',
      pointsMultiplier: 2,
      riskLevel: 'medium',
      resultOptionId: 'm4a',
      options: [
        { id: 'm4a', label: 'Shadow Wolves', pct: 55 },
        { id: 'm4b', label: 'Crimson Apex', pct: 45 },
      ],
    },
  ]

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'PredictKing', level: 24, points: 48_900, marker: 'vip' },
    { rank: 2, name: 'StatWizard', level: 22, points: 41_200, marker: 'verified' },
    { rank: 3, name: 'AceShotcaller', level: 20, points: 36_750, marker: null },
    { rank: 4, name: 'PulseKing', level: 12, points: 28_410, marker: null, isCurrentUser: true },
    { rank: 5, name: 'MidDiff', level: 18, points: 22_300, marker: null },
  ]

  const chat: ChatMessage[] = [
    { id: 'c1', author: 'PredictKing', text: 'Wolves throwing the lead, classic 😅', timeLabel: 'just now', votes: 1_200, badge: 'vip' },
    { id: 'c2', author: 'ApexFan', text: 'Comeback incoming, trust 🔴', timeLabel: '20s ago', votes: 640, badge: null },
    { id: 'c3', author: 'StatWizard', text: 'Objective control 62% to Apex this game', timeLabel: '40s ago', votes: 510, badge: 'verified' },
    { id: 'c4', author: 'MidDiff', text: 'locked Over 4.5, this goes 5 maps', timeLabel: '1m ago', votes: 305, badge: null },
  ]

  const activity: RoomActivityItem[] = [
    { id: 'a1', icon: 'swords', text: 'First blood — Shadow Wolves', timeLabel: '32:10', tone: 'accent' },
    { id: 'a2', icon: 'trophy', text: 'PredictKing won 1,200 VP on First Blood', timeLabel: '31:58', tone: 'green' },
    { id: 'a3', icon: 'users', text: '2,140 fans joined the room', timeLabel: '30:12', tone: 'neutral' },
    { id: 'a4', icon: 'target', text: 'New market opened — First objective', timeLabel: '29:40', tone: 'accent' },
  ]

  return {
    id: _roomId,
    event,
    streamCategory: 'moba',
    theme: 'esports',
    markets,
    leaderboard,
    chat,
    activity,
    walletPoints: 12_560,
  }
}
