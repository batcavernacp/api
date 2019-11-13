import express from 'express'
import { createServer } from 'http'
import apolloServer from './apollo'
import { assistant } from './google-actions'
import bodyParser from 'body-parser'
import { schema } from './graphql/schema'
import * as Adapter from 'ask-sdk-express-adapter'
import { buildSkills } from './alexa-actions'
import { PortaoIntentHandler } from './alexa/PortaoIntentHandler'
const { ExpressAdapter } = Adapter

function authMiddleware (req, res, next): void {
  const buff = Buffer.from(req.headers.authorization.split(' ')[1], 'base64')
  const text = buff.toString('ascii')

  if (text !== process.env.DIALOGFLOW_SECRET) res.sendStatus(401)

  next()
}

const adapter = new ExpressAdapter(buildSkills([PortaoIntentHandler]), true, true)

const app = express()

app.get('/graphql/schema', (req, res) => res.send(schema.typeDefs))

app.post('/dialogflow', bodyParser.json(), authMiddleware, assistant)

app.post('/alexa', adapter.getRequestHandlers())

apolloServer.applyMiddleware({ app })

const httpServer = createServer(app)

apolloServer.installSubscriptionHandlers(httpServer)

export default httpServer
