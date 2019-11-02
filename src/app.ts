import express from 'express'
import { createServer } from 'http'
import apolloServer from './apollo'
import { assistant } from './google-actions'
import bodyParser from 'body-parser'
import { schema } from './graphql/schema'

function authMiddleware (req, res, next): void {
  const buff = Buffer.from(req.headers.authorization.split(' ')[1], 'base64')
  const text = buff.toString('ascii')

  if (text !== process.env.DIALOGFLOW_SECRET) res.sendStatus(401)

  next()
}

const app = express()

app.get('/graphql/schema', (req, res) => res.send(schema.typeDefs))

app.post('/dialogflow', bodyParser.json(), authMiddleware, assistant)

apolloServer.applyMiddleware({ app })

const httpServer = createServer(app)

apolloServer.installSubscriptionHandlers(httpServer)

export default httpServer
