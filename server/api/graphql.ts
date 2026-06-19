import { createSchema, createYoga } from 'graphql-yoga'

/**
 * GraphQL Yoga endpoint for dashboard-level queries (mounted at /api/graphql).
 *
 * REST (Nitro routes) handles simple actions; GraphQL handles the richer, nested
 * dashboard reads in a single round-trip. Browsable GraphiQL playground at GET
 * /api/graphql. Resolvers return mocked data shaped like the eventual analytics feed.
 */

const typeDefs = /* GraphQL */ `
  type RoomSummary {
    id: ID!
    title: String!
    category: String!
    participants: Int!
    prizePool: Int!
  }

  type PerformanceMetrics {
    apiResponseMs: Int!
    wsLatencyMs: Int!
    clientErrorRate: Float!
    cacheHitRate: Float!
    predictionResolutionFailures: Int!
  }

  type LiveOverview {
    activeRooms: Int!
    activeUsers: Int!
    votesPerMin: Int!
    pointsDistributed: Int!
    performance: PerformanceMetrics!
    topRooms: [RoomSummary!]!
  }

  type Query {
    "Aggregated metrics for the live/admin dashboards."
    liveOverview: LiveOverview!
  }
`

const resolvers = {
  Query: {
    liveOverview: () => ({
      activeRooms: 158,
      activeUsers: 24_361,
      votesPerMin: 8_726,
      pointsDistributed: 1_240_000,
      performance: {
        apiResponseMs: 38,
        wsLatencyMs: 42,
        clientErrorRate: 0.18,
        cacheHitRate: 96.4,
        predictionResolutionFailures: 0,
      },
      topRooms: [
        { id: 'r1', title: 'Madrid vs Bayern', category: 'football', participants: 8_452, prizePool: 250_000 },
        { id: 'r2', title: 'Ferrari vs Red Bull', category: 'f1', participants: 3_214, prizePool: 150_000 },
        { id: 'r3', title: 'Shadow Wolves vs Crimson Apex', category: 'esports', participants: 2_980, prizePool: 125_000 },
      ],
    }),
  },
}

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  // Browsable playground in dev; harmless in this mocked MVP.
  graphiql: true,
})

// Bridge Nitro/h3 <-> Yoga. Use handleNodeRequest + explicit flush (returning a raw
// web Response doesn't reliably stream through Nitro). Handles GET playground + POST queries.
export default defineEventHandler(async (event) => {
  const response = await yoga.handleNodeRequest(event.node.req)
  response.headers.forEach((value, key) => setResponseHeader(event, key, value))
  setResponseStatus(event, response.status)
  return await response.text()
})
