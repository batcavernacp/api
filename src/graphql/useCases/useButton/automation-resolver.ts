import { Context } from '../../../apollo'
import { CODES } from '../../../error'
import { SwitchInput, LogAction } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'

exports.resolver = {
  SwitchedPayload: {
    device: async ({ device: channel }, _, { repositories, services }: Context) => {
      if (!channel) return null
      let deviceId = await services.redis.get(channel)

      if (!deviceId) {
        const d = await repositories.mongoose.models.Device.findOne({ channel }, { _id: 1 })
        if (!d) throw new Error('asd')
        await services.redis.set(channel, d._id.toString())
        deviceId = d._id
      }
      return {
        id: deviceId
      }
    }

  },

  Mutation: {
    switch: async (_, { input }: Input<SwitchInput>, { services, repositories, user }: Context): Promise<boolean> => {
      const { redis } = services
      const { Device, Log } = repositories.mongoose.models
      let topic = await redis.get(input.device)

      let channel = '/' + input.turn

      input.device = fromGlobalId(input.device).id

      if (!topic) {
        const device = await Device.findOne({ _id: input.device }, { channel: 1 })
        if (!device) throw new Error(CODES.NOT_FOUND)
        topic = device.channel
        redis.set(input.device, device.channel)
      }

      // todo: improve speed
      const device = await Device.findOne({
        $and: [{
          _id: input.device,
          $or: [{ usersInvited: user }, { owner: user }]
        }]
      }, { _id: 1 })

      if (!device) throw new Error(CODES.UNAUTHORIZED)

      channel += topic

      services.mqtt.publish(channel, '1')

      await Log.log({
        user,
        device: device._id,
        action: input.turn === 'ON' ? LogAction.On : LogAction.Off
      })
      return true
    }
  },

  Subscription: {
    switched: {
      subscribe: (_, params, { services, user }: Context) => {
        console.log('subscribed', user)
        // TODO: add filter
        return services.pubsub.asyncIterator('SWITCHED')
      }
    }
  }
}
