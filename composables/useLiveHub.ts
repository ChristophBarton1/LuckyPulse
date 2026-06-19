import type {
  CategoryTile,
  ChatMessage,
  CurrentUser,
  LeaderboardEntry,
  LiveEvent,
  LiveStat,
  NavItem,
  PredictionRoomSummary,
  SpinSegment,
  StartingSoonItem,
} from '~/types/domain'

/**
 * Live Hub mock data source.
 *
 * Stands in for the server/WebSocket feed during the UI build. It is shaped exactly
 * like the eventual adapter output (typed against ~/types/domain), so swapping to a
 * real `useFetch('/api/...')` later is a drop-in change.
 *
 * Legal-safe content: virtual points only; esports orgs + the fight promotion are
 * fictional (no trademarks/IP); crests render as initials + gradients, never logos.
 */
export function useLiveHub() {
  const user: CurrentUser = {
    name: 'PulseKing',
    level: 12,
    levelTitle: 'Rookie',
    virtualPoints: 125_840,
    xp: 3_240,
    xpToNext: 5_000,
    dailyStreak: 7,
  }

  const heroEvent: LiveEvent = {
    id: 'evt-ucl-rm-fcb',
    type: 'sports',
    category: 'football',
    theme: 'football',
    competition: 'Champions League',
    stage: 'Semi Final',
    status: 'live',
    clock: '67:34',
    home: { name: 'Madrid', shortName: 'RM', score: 2, goals: ["V. Jr. 23'", "Bellingham 45+2'"] },
    away: { name: 'Bayern', shortName: 'FCB', score: 1, goals: ["Kane 15'"] },
    prizePool: 250_000,
    watching: 8_452,
  }

  const categories: CategoryTile[] = [
    { category: 'football', theme: 'football', label: 'Football', roomCount: 56, live: true, icon: 'goal' },
    { category: 'f1', theme: 'f1', label: 'Formula 1', roomCount: 18, live: true, icon: 'car-front' },
    { category: 'esports', theme: 'esports', label: 'Esports', roomCount: 74, live: true, icon: 'gamepad-2' },
    { category: 'tennis', theme: 'tennis', label: 'Tennis', roomCount: 22, live: true, icon: 'circle-dot' },
    { category: 'fight', theme: 'fight', label: 'Fight Night', roomCount: 16, live: true, icon: 'swords' },
  ]

  const predictionRooms: PredictionRoomSummary[] = [
    { id: 'r1', rank: 1, title: 'Madrid vs Bayern', subtitle: 'Champions League', category: 'football', theme: 'football', participants: 8_452, prizePool: 250_000 },
    { id: 'r2', rank: 2, title: 'Ferrari vs Red Bull', subtitle: 'Miami Grand Prix', category: 'f1', theme: 'f1', participants: 3_214, prizePool: 150_000 },
    { id: 'r3', rank: 3, title: 'Shadow Wolves vs Crimson Apex', subtitle: 'MOBA Championship', category: 'esports', theme: 'esports', participants: 2_980, prizePool: 125_000 },
    { id: 'r4', rank: 4, title: 'Alcaraz vs Djokovic', subtitle: 'Italian Open Final', category: 'tennis', theme: 'tennis', participants: 1_842, prizePool: 100_000 },
    { id: 'r5', rank: 5, title: 'Fight Night Main Card', subtitle: 'Light Heavyweight Bout', category: 'fight', theme: 'fight', participants: 1_521, prizePool: 75_000 },
  ]

  const startingSoon: StartingSoonItem[] = [
    { id: 's1', category: 'f1', theme: 'f1', title: 'Monaco Grand Prix', subtitle: 'Practice 1', startsInLabel: '15m', startTime: '09:30', participants: 1_125, prizePool: 50_000 },
    { id: 's2', category: 'esports', theme: 'esports', title: 'Frost vs Ember', subtitle: 'Tactical Shooter Finals', startsInLabel: '45m', startTime: '10:00', participants: 1_890, prizePool: 75_000 },
    { id: 's3', category: 'tennis', theme: 'tennis', title: 'Swiatek vs Sabalenka', subtitle: 'French Open Semis', startsInLabel: '1h 45m', startTime: '11:00', participants: 1_230, prizePool: 60_000 },
    { id: 's4', category: 'fight', theme: 'fight', title: 'Canelo vs Munguia', subtitle: 'Super Middleweight', startsInLabel: '2h 45m', startTime: '12:00', participants: 980, prizePool: 80_000 },
  ]

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'PredictKing', level: 24, points: 2_450_860, marker: 'vip' },
    { rank: 2, name: 'StatWizard', level: 22, points: 2_125_330, marker: 'verified' },
    { rank: 3, name: 'AlphaOracle', level: 20, points: 1_785_420, marker: null },
    { rank: 4, name: 'FootyQueen', level: 19, points: 1_456_780, marker: null },
    { rank: 5, name: 'ClutchMaster', level: 18, points: 1_234_560, marker: null },
  ]

  const chatMessages: ChatMessage[] = [
    { id: 'c1', author: 'PredictKing', text: 'That Bellingham goal was pure class! 🔥', timeLabel: 'just now', votes: 2_100, badge: 'vip' },
    { id: 'c2', author: 'Madridista_07', text: "Let's close this out! Hala Madrid! 🤍", timeLabel: 'just now', votes: 1_400, badge: null },
    { id: 'c3', author: 'BayernFan94', text: 'Come on Bayern! Still time! 🔴', timeLabel: '30s ago', votes: 980, badge: null },
    { id: 'c4', author: 'StatWizard', text: 'Madrid controlling possession at 62%', timeLabel: '45s ago', votes: 760, badge: 'verified' },
    { id: 'c5', author: 'FootyQueen', text: 'More goals incoming, I can feel it! 😎', timeLabel: '1m ago', votes: 650, badge: null },
  ]

  // Neutral chips (blitz-style restraint); meaningful color is reserved for trend deltas.
  const liveStats: LiveStat[] = [
    { key: 'users', label: 'Active Users', value: 24_361, icon: 'users', accent: 'neutral' },
    { key: 'rooms', label: 'Live Rooms', value: 118, icon: 'radio', accent: 'neutral' },
    { key: 'votes', label: 'Votes / Min', value: 8_726, icon: 'activity', accent: 'neutral' },
    { key: 'latency', label: 'WebSocket Latency', value: '42ms', icon: 'gauge', accent: 'neutral' },
  ]

  const spinSegments: SpinSegment[] = [
    { label: '250', kind: 'points', value: 250 },
    { label: '1,000', kind: 'points', value: 1_000 },
    { label: '500', kind: 'points', value: 500 },
    { label: '2,000', kind: 'points', value: 2_000 },
    { label: '5,000', kind: 'points', value: 5_000 },
    { label: '3,000', kind: 'points', value: 3_000 },
    { label: '10,000', kind: 'points', value: 10_000 },
    { label: '8,000', kind: 'points', value: 8_000 },
  ]

  const primaryNav: NavItem[] = [
    { label: 'Live Hub', to: '/live', icon: 'house' },
    { label: 'My Rooms', to: '/my-rooms', icon: 'layout-grid' },
    { label: 'Predictions', to: '/predictions', icon: 'target' },
    { label: 'Portfolio', to: '/portfolio', icon: 'wallet' },
    { label: 'History', to: '/history', icon: 'history' },
    { label: 'Friends', to: '/friends', icon: 'users' },
    { label: 'Alerts', to: '/alerts', icon: 'bell', badge: 3 },
    { label: 'Settings', to: '/settings', icon: 'settings' },
  ]

  const topNav: NavItem[] = [
    { label: 'Live', to: '/live', icon: 'radio' },
    { label: 'Sports', to: '/sports', icon: 'trophy' },
    { label: 'Esports', to: '/esports', icon: 'gamepad-2' },
    { label: 'Leaderboard', to: '/leaderboard', icon: 'medal' },
    { label: 'Rewards', to: '/rewards', icon: 'gift' },
    { label: 'Analytics', to: '/analytics', icon: 'chart-no-axes-column' },
  ]

  return {
    user,
    heroEvent,
    categories,
    predictionRooms,
    startingSoon,
    leaderboard,
    chatMessages,
    liveStats,
    spinSegments,
    primaryNav,
    topNav,
  }
}
