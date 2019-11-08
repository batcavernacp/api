import { Context } from '../../../apollo'
import { MyDevicesPayload } from '../../../generated/graphql'

exports.resolver = {
  MyDevicesPayload: {
    owned: async ({ owned }, _, { loaders }: Context, info) =>
      loaders.devices.loadMany(await owned),

    guest: async ({ guest }, _, { loaders }: Context, info) =>
      loaders.devices.loadMany(await guest)
  },

  Query: {
    myDevices: (_, params, { repositories, user }: Context): MyDevicesPayload => ({
      owned: repositories.mongoose.models.User.getField({ _id: user }, 'devicesOwned'),
      guest: repositories.mongoose.models.User.getField({ _id: user }, 'devicesInvited')
    })
  }
}
