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

const SPORT_CHAT: ChatMessage[] = [
  { id: 'c1', author: 'PredictKing', text: 'big momentum swing 🔥', timeLabel: 'just now', votes: 1_100, badge: 'vip' },
  { id: 'c2', author: 'NovaStar', text: 'locking my pick now', timeLabel: '25s ago', votes: 540, badge: null },
  { id: 'c3', author: 'StatWizard', text: 'the data favours the leader here', timeLabel: '50s ago', votes: 470, badge: 'verified' },
]
const SPORT_ACTIVITY: RoomActivityItem[] = [
  { id: 'a1', icon: 'trophy', text: 'PredictKing won 1,500 VP', timeLabel: 'now', tone: 'green' },
  { id: 'a2', icon: 'target', text: 'New market opened', timeLabel: '1m', tone: 'accent' },
  { id: 'a3', icon: 'users', text: '1,240 fans joined the room', timeLabel: '3m', tone: 'neutral' },
]

interface SportConfig {
  theme: SportTheme
  category: RoomData['event']['category']
  competition: string
  stage: string
  clock: string
  home: RoomData['event']['home']
  away: RoomData['event']['away']
  prizePool: number
  watching: number
  broadcaster: RoomData['broadcaster']
  companion: CompanionData
  markets: PredictionMarket[]
}

function makeSportRoom(id: string, cfg: SportConfig): RoomData {
  return {
    id,
    kind: 'sports',
    theme: cfg.theme,
    streamCategory: 'esports',
    broadcaster: cfg.broadcaster,
    companion: cfg.companion,
    event: {
      id,
      type: 'sports',
      category: cfg.category,
      theme: cfg.theme,
      competition: cfg.competition,
      stage: cfg.stage,
      status: 'live',
      clock: cfg.clock,
      home: cfg.home,
      away: cfg.away,
      prizePool: cfg.prizePool,
      watching: cfg.watching,
    },
    markets: cfg.markets,
    leaderboard: SHARED_LEADERBOARD,
    chat: SPORT_CHAT,
    activity: SPORT_ACTIVITY,
    walletPoints: 12_560,
  }
}

const SPORT_ROOMS: Record<string, () => RoomData> = {
  f1: () =>
    makeSportRoom('f1', {
      theme: 'f1',
      category: 'f1',
      competition: 'Grand Prix',
      stage: 'Lap 38 / 58',
      clock: 'LAP 38',
      home: { name: 'Verstappen', shortName: 'VER', score: 1 },
      away: { name: 'Norris', shortName: 'NOR', score: 2 },
      prizePool: 180_000,
      watching: 9_400,
      broadcaster: { name: 'Official broadcaster', url: 'https://www.formula1.com/' },
      companion: {
        winProbHome: 57,
        stats: [
          { label: 'Gap', home: 'leader', away: '+1.8s' },
          { label: 'Pit stops', home: 1, away: 1 },
          { label: 'Fastest lap', home: '1:31.2', away: '1:31.9' },
        ],
        timeline: [
          { id: 'l38', minute: 'L38', type: 'info', side: 'away', text: 'Norris closing the gap to 1.8s' },
          { id: 'l31', minute: 'L31', type: 'info', text: 'Safety car ends — racing resumes' },
          { id: 'l18', minute: 'L18', type: 'info', side: 'away', text: 'Norris pits — undercut attempt' },
          { id: 'l1', minute: 'L1', type: 'kickoff', text: 'Lights out — race start' },
        ],
      },
      markets: [
        { id: 'f1m1', question: 'Race winner', marketType: 'RACE_WINNER', status: 'open', closesInLabel: '5:00', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'ver', label: 'Verstappen', pct: 57 }, { id: 'nor', label: 'Norris', pct: 34 }, { id: 'fld', label: 'Field', pct: 9 }] },
        { id: 'f1m2', question: 'Another safety car?', marketType: 'SAFETY_CAR', status: 'open', closesInLabel: '2:10', pointsMultiplier: 3, riskLevel: 'high', options: [{ id: 'sy', label: 'Yes', pct: 38 }, { id: 'sn', label: 'No', pct: 62 }] },
        { id: 'f1m3', question: 'Fastest lap', marketType: 'FASTEST_LAP', status: 'closing', closesInLabel: '0:20', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'flv', label: 'Verstappen', pct: 49 }, { id: 'fln', label: 'Norris', pct: 51 }] },
      ],
    }),
  tennis: () =>
    makeSportRoom('tennis', {
      theme: 'tennis',
      category: 'tennis',
      competition: 'Masters Final',
      stage: 'Set 2',
      clock: 'SET 2',
      home: { name: 'Alcaraz', shortName: 'ALC', score: 1 },
      away: { name: 'Djokovic', shortName: 'DJO', score: 0 },
      prizePool: 120_000,
      watching: 7_300,
      broadcaster: { name: 'Official broadcaster', url: 'https://www.atptour.com/' },
      companion: {
        winProbHome: 53,
        stats: [
          { label: 'Aces', home: 7, away: 5 },
          { label: 'Winners', home: 22, away: 19 },
          { label: 'Break pts won', home: 3, away: 2 },
        ],
        timeline: [
          { id: 's2', minute: 'S2', type: 'info', side: 'home', text: 'Alcaraz breaks to lead 3–2' },
          { id: 's1', minute: 'S1', type: 'goal', side: 'home', text: 'Alcaraz takes the first set 6–4' },
          { id: 's0', minute: '0:00', type: 'kickoff', text: 'Match start' },
        ],
      },
      markets: [
        { id: 'tnm1', question: 'Match winner', marketType: 'MATCH_WINNER', status: 'open', closesInLabel: '4:00', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'alc', label: 'Alcaraz', pct: 53 }, { id: 'djo', label: 'Djokovic', pct: 47 }] },
        { id: 'tnm2', question: 'Tie-break this set?', marketType: 'TIE_BREAK', status: 'open', closesInLabel: '1:30', pointsMultiplier: 3, riskLevel: 'high', options: [{ id: 'tby', label: 'Yes', pct: 41 }, { id: 'tbn', label: 'No', pct: 59 }] },
        { id: 'tnm3', question: 'Total sets', marketType: 'OVER_UNDER', status: 'open', closesInLabel: '6:00', pointsMultiplier: 2, riskLevel: 'low', options: [{ id: 's2o', label: 'Over 2.5', pct: 58 }, { id: 's2u', label: 'Under 2.5', pct: 42 }] },
      ],
    }),
  fight: () =>
    makeSportRoom('fight', {
      theme: 'fight',
      category: 'fight',
      competition: 'Fight Night',
      stage: 'Round 3 / 5',
      clock: 'R3',
      home: { name: 'Silva', shortName: 'SIL', score: 0 },
      away: { name: 'Costa', shortName: 'COS', score: 0 },
      prizePool: 90_000,
      watching: 6_100,
      broadcaster: { name: 'Official broadcaster', url: 'https://www.youtube.com/results?search_query=official+fight+highlights' },
      companion: {
        winProbHome: 60,
        stats: [
          { label: 'Sig. strikes', home: 64, away: 41 },
          { label: 'Takedowns', home: 2, away: 0 },
          { label: 'Control (min)', home: 4, away: 1 },
        ],
        timeline: [
          { id: 'r3', minute: 'R3', type: 'info', side: 'home', text: 'Silva controlling the round' },
          { id: 'r2', minute: 'R2', type: 'chance', side: 'home', text: 'Silva lands takedown' },
          { id: 'r1', minute: 'R1', type: 'kickoff', text: 'Round 1 begins' },
        ],
      },
      markets: [
        { id: 'fgm1', question: 'Fight winner', marketType: 'FIGHT_WINNER', status: 'open', closesInLabel: '3:00', pointsMultiplier: 2, riskLevel: 'medium', options: [{ id: 'sil', label: 'Silva', pct: 60 }, { id: 'cos', label: 'Costa', pct: 40 }] },
        { id: 'fgm2', question: 'Method of victory', marketType: 'METHOD_OF_VICTORY', status: 'open', closesInLabel: '2:00', pointsMultiplier: 3, riskLevel: 'high', options: [{ id: 'ko', label: 'KO/TKO', pct: 38 }, { id: 'sub', label: 'Submission', pct: 22 }, { id: 'dec', label: 'Decision', pct: 40 }] },
        { id: 'fgm3', question: 'Goes the distance?', marketType: 'ROUND_ENDING', status: 'open', closesInLabel: '4:30', pointsMultiplier: 2, riskLevel: 'low', options: [{ id: 'dy', label: 'Yes', pct: 55 }, { id: 'dn', label: 'No', pct: 45 }] },
      ],
    }),
}

/**
 * Mocked room aggregate. Esports rooms (id 'r3') embed live Twitch video; sport rooms
 * (football / f1 / tennis / fight) use the legal Watch Companion (real-data-driven, no
 * restream). Swappable for a real server/WebSocket feed without touching the page.
 */
export function useRoom(roomId: string): RoomData {
  if (roomId === 'r3') return esportsRoom(roomId)
  if (SPORT_ROOMS[roomId]) return SPORT_ROOMS[roomId]()
  return footballRoom(roomId)
}
