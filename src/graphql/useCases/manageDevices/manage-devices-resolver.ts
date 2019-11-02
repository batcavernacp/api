import { Context } from '../../../apollo'
import { MyDevicesPayload, Device } from '../../../generated/graphql'

exports.resolver = {
  MyDevicesPayload: {
    devices: async ({ devices }, _, { repositories }: Context, info): Promise<[Device]> =>
      repositories.mongoose.models.Device.loadMany(await devices, info)
  },

  Query: {
    myDevices: (_, params, { repositories, user }: Context): MyDevicesPayload => ({
      devices: repositories.mongoose.models.User.getField({ _id: user }, 'devicesOwned') // lista de ids,
    })
  }
}
