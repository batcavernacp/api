import { fromGlobalId, toGlobalId, ResolvedGlobalId } from 'graphql-relay'
import { CODES } from '../error'

const nodes = {
  User: 'User'
}

exports.resolver = {
  Node: {
    __resolveType: ({ type }) => {
      if (nodes[type]) return type
      throw new Error(CODES.INVALID_ID)
    },
    id: ({ id, type }) => toGlobalId(type, id)
  },
  Query: {
    node: (_, { id }): ResolvedGlobalId => fromGlobalId(id)
  }
}
