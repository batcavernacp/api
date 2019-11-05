import { Context } from '../../../apollo'
import { MyDevicesPayload } from '../../../generated/graphql'

exports.resolver = {
  MyDevicesPayload: {
    owned: async ({ owned }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Device.loadMany(await owned, info),

    guest: async ({ guest }, _, { repositories }: Context, info) =>
      repositories.mongoose.models.Device.loadMany(await guest, info)
  },

  Query: {
    myDevices: (_, params, { repositories, user }: Context): MyDevicesPayload => ({
      owned: repositories.mongoose.models.User.getField({ _id: user }, 'devicesOwned'),
      guest: repositories.mongoose.models.User.getField({ _id: user }, 'devicesInvited')
    })
  }
}
