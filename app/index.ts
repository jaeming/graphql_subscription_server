/* eslint-disable import/first */
require('dotenv').config()
import http from 'http'
import 'module-alias/register'
import 'graphql-import-node'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import ws from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { execute, subscribe } from 'graphql'
import express from 'express'
import cors from 'cors'
import resolvers from './resolvers'
import * as typeDefs from './schema.graphql'
import { RedisPubSub } from 'graphql-redis-subscriptions'
const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL || '127.0.0.1'

export const pubsub = new RedisPubSub({
  publisher: new Redis(6379, REDIS_URL),
  subscriber: new Redis(6379, REDIS_URL)
})

const PORT = process.env.PORT || 4000

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  uploads: false, // using graphqlUploadExpress middleware instead
  playground: true,
  introspection: true
  // context: async ({ req }) => {}
})

const app = express()
app.use(cors())

apollo.applyMiddleware({ app })

const server = http.createServer(app)

// create websocket server
const wsServer = new ws.Server({
  server,
  path: '/graphql'
})

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

server.listen(PORT, () => {
  useServer({ schema, execute, subscribe }, wsServer)
  console.log(`🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apollo.subscriptionsPath}`)
})
