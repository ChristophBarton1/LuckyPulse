import type { StreamInfo } from '~/types/domain'
import { fetchLiveStreams } from '~/server/utils/twitch'

/**
 * GET /api/streams/live?category=moba&first=6
 *
 * Returns embeddable LIVE streams for a category. When a Twitch dev app is configured
 * it auto-discovers the top live channels via Helix; otherwise it returns a curated
 * list of official, embeddable channels (which may or may not be live — the embed
 * shows the channel's offline screen gracefully). Legal-safe: official platform
 * embeds only, never rehosted/pirated streams.
 */

// Category -> Twitch game name (resolved to a game_id server-side).
const GAME_BY_CATEGORY: Record<string, string | undefined> = {
  esports: 'League of Legends',
  moba: 'League of Legends',
  'tactical-shooter': 'VALORANT',
  shooter: 'VALORANT',
  'battle-royale': 'Fortnite',
  fighting: 'Street Fighter 6',
  strategy: 'StarCraft II',
}

// Curated official/embeddable channels used when Helix isn't configured.
const FALLBACK: Record<string, StreamInfo[]> = {
  esports: [
    { provider: 'twitch', channel: 'riotgames', streamer: 'Riot Games', game: 'League of Legends' },
    { provider: 'twitch', channel: 'valorant', streamer: 'VALORANT', game: 'VALORANT' },
    { provider: 'twitch', channel: 'fortnite', streamer: 'Fortnite', game: 'Fortnite' },
  ],
  moba: [{ provider: 'twitch', channel: 'riotgames', streamer: 'Riot Games', game: 'League of Legends' }],
  'tactical-shooter': [{ provider: 'twitch', channel: 'valorant', streamer: 'VALORANT', game: 'VALORANT' }],
  'battle-royale': [{ provider: 'twitch', channel: 'fortnite', streamer: 'Fortnite', game: 'Fortnite' }],
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = String(query.category ?? 'esports')
  const first = Math.min(Number(query.first ?? 6) || 6, 12)

  const live = await fetchLiveStreams(GAME_BY_CATEGORY[category], first)
  if (live && live.length > 0) {
    return { source: 'twitch-live' as const, category, streams: live }
  }

  const fallback = FALLBACK[category] ?? FALLBACK.esports
  return { source: 'fallback' as const, category, streams: fallback }
})
