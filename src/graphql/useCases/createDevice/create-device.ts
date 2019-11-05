import { Context } from '../../../apollo'
import { CreateDevicePayload, CreateDeviceInput } from '../../../generated/graphql'
import { Input } from '../../schema'

exports.resolver = {
  Mutation: {
    createDevice: async (_, { input }: Input<CreateDeviceInput>, { repositories }: Context): Promise<CreateDevicePayload> => {
      const { Device } = repositories.mongoose.models
      const newDevice = await Device.register(input.device)
      return {
        token: Device.getToken(newDevice._id)
      }
    }
  }
}
