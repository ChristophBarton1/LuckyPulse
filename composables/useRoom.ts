import type {
  Broadcaster,
  ChatMessage,
  CompanionStat,
  LeaderboardEntry,
  LiveEvent,
  MatchEvent,
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

export interface CompanionData {
  /** Home win probability 0–100 (away = 100 - home, minus draw shown separately if any). */
  winProbHome: number
  drawProb?: number
  timeline: MatchEvent[]
  stats: CompanionStat[]
}

export interface RoomData {
  id: string
  /** 'esports' rooms embed live video; 'sports' rooms use the Watch Companion. */
  kind: 'sports' | 'esports'
  event: LiveEvent
  theme: SportTheme
  /** Twitch discovery category (esports rooms only). */
  streamCategory: 'moba' | 'tactical-shooter' | 'battle-royale' | 'esports'
  /** Real-data companion (sports rooms only). */
  companion?: CompanionData
  /** Official rights-holder to deep-link to (sports rooms; we never restream). */
  broadcaster?: Broadcaster
  markets: PredictionMarket[]
  leaderboard: LeaderboardEntry[]
  chat: ChatMessage[]
  activity: RoomActivityItem[]
  walletPoints: number
}

const SHARED_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'PredictKing', level: 24, points: 48_900, marker: 'vip' },
  { rank: 2, name: 'StatWizard', level: 22, points: 41_200, marker: 'verified' },
  { rank: 3, name: 'AceShotcaller', level: 20, points: 36_750, marker: null },
  { rank: 4, name: 'PulseKing', level: 12, points: 28_410, marker: null, isCurrentUser: true },
  { rank: 5, name: 'MidDiff', level: 18, points: 22_300, marker: null },
]

function esportsRoom(id: string): RoomData {
  return {
    id,
    kind: 'esports',
    theme: 'esports',
    streamCategory: 'moba',
    event: {
      id,
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
    },
    markets: [
      { id: 'm1', question: 'Match winner', marketType: 'MATCH_WINNER', status: 'open', closesInLabel: '1:20', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'm1a', label: 'Shadow Wolves', pct: 58 }, { id: 'm1b', label: 'Crimson Apex', pct: 42 }] },
      { id: 'm2', question: 'First objective (Game 3)', marketType: 'ESPORT_FIRST_OBJECTIVE', status: 'open', closesInLabel: '0:45', pointsMultiplier: 3, riskLevel: 'high', options: [{ id: 'm2a', label: 'Shadow Wolves', pct: 51 }, { id: 'm2b', label: 'Crimson Apex', pct: 49 }] },
      { id: 'm3', question: 'Total maps over/under 4.5', marketType: 'OVER_UNDER', status: 'closing', closesInLabel: '0:08', pointsMultiplier: 2, riskLevel: 'low', options: [{ id: 'm3a', label: 'Over 4.5', pct: 64 }, { id: 'm3b', label: 'Under 4.5', pct: 36 }] },
      { id: 'm4', question: 'First blood', marketType: 'ESPORT_FIRST_BLOOD', status: 'resolved', pointsMultiplier: 2, riskLevel: 'medium', resultOptionId: 'm4a', options: [{ id: 'm4a', label: 'Shadow Wolves', pct: 55 }, { id: 'm4b', label: 'Crimson Apex', pct: 45 }] },
    ],
    leaderboard: SHARED_LEADERBOARD,
    chat: [
      { id: 'c1', author: 'PredictKing', text: 'Wolves throwing the lead, classic 😅', timeLabel: 'just now', votes: 1_200, badge: 'vip' },
      { id: 'c2', author: 'ApexFan', text: 'Comeback incoming, trust 🔴', timeLabel: '20s ago', votes: 640, badge: null },
      { id: 'c3', author: 'StatWizard', text: 'Objective control 62% to Apex this game', timeLabel: '40s ago', votes: 510, badge: 'verified' },
    ],
    activity: [
      { id: 'a1', icon: 'swords', text: 'First blood — Shadow Wolves', timeLabel: '32:10', tone: 'accent' },
      { id: 'a2', icon: 'trophy', text: 'PredictKing won 1,200 VP on First Blood', timeLabel: '31:58', tone: 'green' },
      { id: 'a3', icon: 'target', text: 'New market opened — First objective', timeLabel: '29:40', tone: 'accent' },
    ],
    walletPoints: 12_560,
  }
}

function footballRoom(id: string): RoomData {
  return {
    id,
    kind: 'sports',
    theme: 'football',
    streamCategory: 'esports',
    event: {
      id,
      type: 'sports',
      category: 'football',
      theme: 'football',
      competition: 'Champions League',
      stage: 'Semi Final',
      status: 'live',
      clock: "67'",
      home: { name: 'Madrid', shortName: 'RM', score: 2, goals: ["V. Jr. 23'", "Bellingham 45+2'"] },
      away: { name: 'Bayern', shortName: 'FCB', score: 1, goals: ["Kane 15'"] },
      prizePool: 250_000,
      watching: 18_900,
    },
    broadcaster: { name: 'Official broadcaster', url: 'https://www.uefa.com/uefachampionsleague/' },
    companion: {
      winProbHome: 64,
      drawProb: 21,
      stats: [
        { label: 'Possession', home: 58, away: 42, bar: true },
        { label: 'Shots', home: 12, away: 7 },
        { label: 'Shots on target', home: 5, away: 3 },
        { label: 'Corners', home: 6, away: 2 },
        { label: 'xG', home: 1.84, away: 0.92 },
      ],
      timeline: [
        { id: 't1', minute: "67'", type: 'chance', side: 'away', text: 'Kane shot saved — great stop' },
        { id: 't2', minute: "45+2'", type: 'goal', side: 'home', text: 'Bellingham scores! Madrid lead 2–1' },
        { id: 't3', minute: "30'", type: 'card', side: 'away', text: 'Yellow card — tactical foul' },
        { id: 't4', minute: "23'", type: 'goal', side: 'home', text: 'Vinícius Jr. equalises' },
        { id: 't5', minute: "15'", type: 'goal', side: 'away', text: 'Kane opens the scoring for Bayern' },
        { id: 't6', minute: "1'", type: 'kickoff', text: 'Kick-off at Fortune Arena' },
      ],
    },
    markets: [
      { id: 'fm1', question: 'Match winner', marketType: 'MATCH_WINNER', status: 'open', closesInLabel: '2:30', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'fm1a', label: 'Madrid', pct: 64 }, { id: 'fm1b', label: 'Draw', pct: 21 }, { id: 'fm1c', label: 'Bayern', pct: 15 }] },
      { id: 'fm2', question: 'Both teams to score', marketType: 'BOTH_TEAMS_SCORE', status: 'resolved', pointsMultiplier: 2, riskLevel: 'low', resultOptionId: 'fm2a', options: [{ id: 'fm2a', label: 'Yes', pct: 78 }, { id: 'fm2b', label: 'No', pct: 22 }] },
      { id: 'fm3', question: 'Over/under 3.5 goals', marketType: 'OVER_UNDER', status: 'open', closesInLabel: '8:00', pointsMultiplier: 3, riskLevel: 'high', options: [{ id: 'fm3a', label: 'Over 3.5', pct: 47 }, { id: 'fm3b', label: 'Under 3.5', pct: 53 }] },
      { id: 'fm4', question: 'Next goal', marketType: 'NEXT_SCORE', status: 'closing', closesInLabel: '0:30', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'fm4a', label: 'Madrid', pct: 55 }, { id: 'fm4b', label: 'Bayern', pct: 30 }, { id: 'fm4c', label: 'No more goals', pct: 15 }] },
    ],
    leaderboard: SHARED_LEADERBOARD,
    chat: [
      { id: 'c1', author: 'PredictKing', text: 'That Bellingham goal was pure class! 🔥', timeLabel: 'just now', votes: 2_100, badge: 'vip' },
      { id: 'c2', author: 'Madridista_07', text: "Let's close this out! Hala Madrid! 🤍", timeLabel: 'just now', votes: 1_400, badge: null },
      { id: 'c3', author: 'StatWizard', text: 'Madrid xG 1.84 — deserved lead', timeLabel: '45s ago', votes: 760, badge: 'verified' },
    ],
    activity: [
      { id: 'a1', icon: 'goal', text: "Bellingham goal (45+2') — Madrid 2–1", timeLabel: "45'", tone: 'accent' },
      { id: 'a2', icon: 'trophy', text: 'PredictKing won 3,000 VP on Next goal', timeLabel: "46'", tone: 'green' },
      { id: 'a3', icon: 'target', text: 'New market opened — Over/under 3.5', timeLabel: "48'", tone: 'accent' },
    ],
    walletPoints: 12_560,
  }
}

/**
 * Mocked room aggregate. The esports demo room (id 'r3') embeds live Twitch video;
 * every other id resolves to the football demo room, which uses the legal Watch
 * Companion (real-data-driven; no broadcast restreaming). Swappable for a real
 * server/WebSocket feed without touching the page.
 */
export function useRoom(roomId: string): RoomData {
  return roomId === 'r3' ? esportsRoom(roomId) : footballRoom(roomId)
}
