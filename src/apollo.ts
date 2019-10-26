import schema from './graphql/schema'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { formatError } from './error'
import services from './services'
import repositories from './repositories'
import controller from './controllers'

const controllers = controller({ services, repositories })

export default new ApolloServer({
  schema: makeExecutableSchema(schema),
  formatError,
  context: async ({ req, connection }) => connection
    ? ({
      user: await controllers.auth.verifyTokenSubscription(connection.context.token),
      controllers
    }) : ({
      token: req.headers.token,
      controllers
    })
})
