import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { formatError } from './error'
import services, { Services } from './services'
import repositories from './repositories'
import controller from './controllers'
import { schema } from './graphql/schema'

const controllers = controller({ services, repositories })

export default new ApolloServer({
  schema: makeExecutableSchema(schema),
  formatError,
  context: async ({ req, connection }) => connection
    ? ({
      user: await controllers.auth.verifyTokenSubscription(connection.context.token),
      controllers,
      services,
      repositories
    }) : ({
      token: req.headers.token,
      controllers,
      services,
      repositories
    })
})

export interface Context {
  token: string;
  services: Services;
  repositories: any;
  user: any;
}
