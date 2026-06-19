// Core domain types for the LuckyPulse product UI.
// First cut, scoped to what the Live Hub needs; the fully-normalised models
// (Prisma-aligned) land with the domain-core sub-project. Everything is read-only
// for the UI — these shapes are produced by mock adapters / server routes.

import type { SportTheme } from './theme'

export type EventCategory =
  | 'football'
  | 'f1'
  | 'tennis'
  | 'basketball'
  | 'fight'
  | 'esports'

export type EventType = 'sports' | 'esports'

export type EventStatus =
  | 'upcoming'
  | 'starting_soon'
  | 'live'
  | 'resolving'
  | 'finished'
  | 'cancelled'

/** A competitor (team / club / player / esports squad). No copyrighted logos — UI
 *  renders initials + a deterministic gradient. `badge` is an optional short tag. */
export interface Competitor {
  name: string
  shortName?: string
  /** Optional accent for the generated crest, otherwise derived from the name. */
  badge?: string
  score?: number
  /** Scorer / key-moment labels for this side, e.g. ["V. Jr. 23'", "Bellingham 45+2'"]. */
  goals?: string[]
}

/** Normalised live/upcoming event shown across the app. */
export interface LiveEvent {
  id: string
  type: EventType
  category: EventCategory
  /** Maps to a sport/esport visual theme. */
  theme: SportTheme
  competition: string
  stage?: string
  home: Competitor
  away: Competitor
  status: EventStatus
  /** Human clock label, e.g. "67:34", "2ND HALF", "LAP 12". */
  clock?: string
  /** ISO start time for upcoming events. */
  startsAt?: string
  /** Goalscorers / key moments, short strings. */
  highlights?: string[]
  /** Virtual-points prize pool for the room. */
  prizePool: number
  watching: number
}

/** A category tile in the "Explore What's Hot" strip. */
export interface CategoryTile {
  category: EventCategory
  theme: SportTheme
  label: string
  roomCount: number
  live: boolean
  icon: string
}

/** A ranked prediction room (Top Prediction Rooms list). */
export interface PredictionRoomSummary {
  id: string
  rank: number
  title: string
  subtitle: string
  category: EventCategory
  theme: SportTheme
  participants: number
  prizePool: number
}

/** An upcoming event in the "Starting Soon" list. */
export interface StartingSoonItem {
  id: string
  category: EventCategory
  theme: SportTheme
  title: string
  subtitle: string
  /** Countdown label, e.g. "15m", "1h 45m". */
  startsInLabel: string
  startTime: string
  participants: number
  prizePool: number
}

/** A leaderboard row. */
export interface LeaderboardEntry {
  rank: number
  name: string
  level: number
  points: number
  /** Optional verified / vip / host marker. */
  marker?: 'verified' | 'vip' | 'host' | null
  isCurrentUser?: boolean
}

/** A live chat message. */
export interface ChatMessage {
  id: string
  author: string
  text: string
  /** Relative time label, e.g. "just now", "30s ago". */
  timeLabel: string
  /** Up-votes / engagement points on the message. */
  votes?: number
  badge?: 'vip' | 'host' | 'verified' | null
}

/** A realtime KPI in the Live Stats rail. */
export interface LiveStat {
  key: string
  label: string
  value: string | number
  icon: string
  accent: 'gold' | 'purple' | 'cyan' | 'green' | 'accent'
  trend?: number
  /** Render the value as a latency/ms style mono figure. */
  unit?: string
}

/** A Daily Spin wheel segment (rewards are virtual points / XP / cosmetics only). */
export interface SpinSegment {
  label: string
  /** points | xp | badge — never real money. */
  kind: 'points' | 'xp' | 'badge'
  value: number
}

/** The signed-in user summary (header + sidebar). */
export interface CurrentUser {
  name: string
  level: number
  levelTitle: string
  virtualPoints: number
  xp: number
  xpToNext: number
  dailyStreak: number
}

/** Sidebar / top navigation item. */
export interface NavItem {
  label: string
  to: string
  icon: string
  badge?: number
}
