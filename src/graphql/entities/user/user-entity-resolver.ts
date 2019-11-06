import { toGlobalId } from 'graphql-relay'

exports.resolver = {
  User: {
    id: ({ id }) => toGlobalId('User', id)
  }
}
