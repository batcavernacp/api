import { toGlobalId } from 'graphql-relay'

exports.resolver = {
  Query: {
    users: (_, { username, ...page }, { controllers }) => ({ users: controllers.user.searchUsername(username, page) }),
    me: (_, params, { user }) => ({ user: { id: user }, test: { id: user } })
  },
  User: {
    username: ({ id, username }, _, { controllers }) => username || controllers.user.load(id, 'username'),
    email: ({ id, email }, _, { controllers }) => email || controllers.user.load(id, 'email')
  },
  UserEdge: {
    cursor: ({ id }) => toGlobalId('User', id),
    node: ({ id }, _, { controllers }, info) => controllers.user.loadBeta(id, info)
  }
}