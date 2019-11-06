import { Context } from '../../../apollo'
import { PageInput } from '../../schema'
import { LogConnection } from '../../../generated/graphql'
import { toGlobalId } from 'graphql-relay'

exports.resolver = {
  Device: {
    id: ({ id }) => toGlobalId('Device', id),

    owner: ({ _doc }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Device.load(_doc.owner, info),

    usersInvited: ({ _doc }, _, { repositories }, info) =>
      repositories.mongoose.models.User.loadMany(_doc.usersInvited, info),

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

    node: ({ id }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Log.load(id, info)
  },

  Log: {
    user: ({ _doc }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.User.load(_doc.user, info)
  }
}
