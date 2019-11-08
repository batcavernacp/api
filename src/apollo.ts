import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { formatError } from './error'
import { Services, services } from './services'
import { Repositories, repositories } from './repositories'
import controller from './controllers'
import { schema } from './graphql/schema'
import { createDataloaders, Loaders } from './loaders/createDataloaders'

const controllers = controller({ services, repositories })

export default new ApolloServer({
  schema: makeExecutableSchema(schema),
  formatError,
  context: async ({ req, connection }) => connection
    ? ({
      user: await controllers.auth.verifyTokenSubscription(connection.context.token),
      services,
      repositories,
      loaders: createDataloaders(repositories)
    }) : ({
      token: req.headers.token,
      services,
      repositories,
      loaders: createDataloaders(repositories)
    })
})

export interface Context {
  token?: string;
  services: Services;
  repositories: Repositories;
  user?: any;
  loaders: Loaders;
}
