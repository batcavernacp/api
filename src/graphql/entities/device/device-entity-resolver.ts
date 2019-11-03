import { Context } from '../../../apollo'

exports.resolver = {
  Device: {
    owner: ({ _doc }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Device.load(_doc.owner, info),

    usersInvited: ({ _doc }, _, { repositories }, info) =>
      repositories.mongoose.models.User.loadMany(_doc.usersInvited, info)
  }
}
