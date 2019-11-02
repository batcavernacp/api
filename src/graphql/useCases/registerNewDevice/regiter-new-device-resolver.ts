import { Context } from '../../../apollo'
import { CreateDevicePayload } from '../../../generated/graphql'

exports.resolver = {
  Mutation: {
    createDevice: async (_, { device }, { repositories }: Context): Promise<CreateDevicePayload> => {
      const { Device } = repositories.mongoose.models
      const newDevice = await Device.register(device)
      return {
        token: Device.getToken(newDevice._id)
      }
    }
  }
}
