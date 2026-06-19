import type { StreamInfo } from '~/types/domain'

/**
 * Server-only Twitch Helix helper.
 *
 * The iframe embed itself needs no credentials — this is purely for *discovering*
 * which channels are currently live for a given game, so the room can feature real
 * live streams. The client secret never leaves the server.
 *
 * Returns `null` when no credentials are configured (or on any error), so callers
 * fall back to a curated channel list.
 */

interface TwitchStream {
  user_login: string
  user_name: string
  title: string
  viewer_count: number
  thumbnail_url: string
  game_name: string
}

// Module-level app-token cache (client_credentials flow).
let tokenCache: { token: string; expiresAt: number } | null = null

async function getAppToken(clientId: string, clientSecret: string): Promise<string | null> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token
  const res = await $fetch<{ access_token: string; expires_in: number }>(
    'https://id.twitch.tv/oauth2/token',
    {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    },
  ).catch(() => null)
  if (!res?.access_token) return null
  tokenCache = { token: res.access_token, expiresAt: Date.now() + res.expires_in * 1000 }
  return res.access_token
}

/** Fetch currently-live Twitch streams for a game name. Null if unconfigured/failed. */
export async function fetchLiveStreams(
  gameName: string | undefined,
  first = 6,
): Promise<StreamInfo[] | null> {
  const cfg = useRuntimeConfig()
  const clientId = cfg.twitchClientId
  const clientSecret = cfg.twitchClientSecret
  if (!clientId || !clientSecret) return null

  const token = await getAppToken(clientId, clientSecret)
  if (!token) return null

  const headers = { 'Client-Id': clientId, Authorization: `Bearer ${token}` }

  let gameId: string | undefined
  if (gameName) {
    const games = await $fetch<{ data: { id: string }[] }>('https://api.twitch.tv/helix/games', {
      headers,
      query: { name: gameName },
    }).catch(() => null)
    gameId = games?.data?.[0]?.id
  }

  const streams = await $fetch<{ data: TwitchStream[] }>('https://api.twitch.tv/helix/streams', {
    headers,
    query: { game_id: gameId, first, type: 'live' },
  }).catch(() => null)

  if (!streams?.data?.length) return null

  return streams.data.map((s) => ({
    provider: 'twitch' as const,
    channel: s.user_login,
    title: s.title,
    streamer: s.user_name,
    viewers: s.viewer_count,
    thumbnail: s.thumbnail_url?.replace('{width}', '640').replace('{height}', '360'),
    game: s.game_name,
  }))
}
