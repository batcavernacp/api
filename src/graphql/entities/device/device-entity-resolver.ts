import { Context } from '../../../apollo'
import { PageInput } from '../../schema'
import { LogConnection } from '../../../generated/graphql'
import { toGlobalId } from 'graphql-relay'

exports.resolver = {
  Device: {
    owner: ({ _doc }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Device.load(_doc.owner, info),

    usersInvited: ({ _doc }, _, { repositories }, info) =>
      repositories.mongoose.models.User.loadMany(_doc.usersInvited, info),

    logs: ({ _doc }, page: PageInput, { repositories }: Context): LogConnection =>
      repositories.mongoose.models.Log.getPage({
        ...page,
        params: {
          device: _doc._id
        }
      })
  },

  LogEdge: {
    node: ({ id }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Log.load(id, info),

    cursor: ({ id }) => toGlobalId('Log', id)
  },

  Log: {
    user: ({ _doc }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.User.load(_doc.user, info)
  }
}
