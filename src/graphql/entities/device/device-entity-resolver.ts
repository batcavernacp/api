import { Context } from '../../../apollo'
import { PageInput } from '../../schema'
import { LogConnection } from '../../../generated/graphql'
import { toGlobalId } from 'graphql-relay'

exports.resolver = {
  Device: {
    id: ({ id }) => toGlobalId('Device', id),

    owner: ({ _doc }, _, { loaders }: Context) =>
      loaders.users.load(_doc.owner),

    usersInvited: ({ _doc }, _, { loaders }: Context) =>
      loaders.users.loadMany(_doc.usersInvited),

    logs: ({ _doc, id }, page: PageInput, { repositories }: Context): LogConnection =>
      repositories.mongoose.models.Log.getPage({
        ...page,
        params: {
          device: id || _doc._id
        }
      })
  },

  LogEdge: {
    cursor: ({ id }) => toGlobalId('Log', id),

    node: ({ id }, _, { loaders }: Context) =>
      loaders.logs.load(id)
  },

  Log: {
    user: ({ user }, _, { loaders }: Context) =>
      loaders.users.load(user)
  }
}
