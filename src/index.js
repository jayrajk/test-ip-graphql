import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'
import { sentry } from 'graphql-middleware-sentry'
import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'

import schemaWithoutMiddleware from './modules'
// import middlewares from './middlewares'
import logger from './logger'
// import models from './models'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

export const sentryMiddleware = sentry({
  sentryInstance: Sentry,
})

const schema = applyMiddleware(
  schemaWithoutMiddleware,
  // ...middlewares,
  sentryMiddleware,
)

const server = new ApolloServer({
  schema,
  context: async (ctx) => ({
    // models,
    req: ctx.req,
  }),
})

const app = express()
const corsOptions = {
  credentials: true,
  origin: true,
}

if (process.env.NODE_ENV === 'development') {
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }))
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(async (req, res, next) => {
  const start = Date.now()
  logger.info({
    hostname: process.env.HOSTNAME,
    time: start,
    url: req.url,
    method: req.method,
    log_type: 'request',
    user_agent: req.headers['user-agent'],
  })
  await next()
})
app.use(express.static('public'))

server.applyMiddleware({ app, cors: false })

const httpServer = createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen(process.env.PORT, () => {
  logger.info(`server started on port ${process.env.PORT}`)
})
