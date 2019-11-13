import { Context } from '../../../apollo'
import { CreateDevicePayload, CreateDeviceInput } from '../../../generated/graphql'
import { Input } from '../../schema'

exports.resolver = {
  Mutation: {
    createDevice: async (_, { input }: Input<CreateDeviceInput>, { repositories, services }: Context): Promise<CreateDevicePayload> => {
      const { Device } = repositories.mongoose.models
      const { redis } = services
      const newDevice = await Device.register(input.device)
      await redis.hset(newDevice._id.toString(), 'channel', newDevice.channel)
      return {
        token: Device.getToken(newDevice._id)
      }
    }
  }
}
