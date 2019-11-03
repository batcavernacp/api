import { Context } from '../../../apollo'

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
    switch: async (_, { input }, { services, repositories }: Context) => {
      const { redis } = services
      // TODO: check if user is allowed to use device
      const topic = await redis.get(input.device)

      let channel = '/' + input.turn
      if (topic) {
        channel += topic
      } else {
        const device = await repositories.mongoose.models.Device.findOne({ _id: input.device }, { channel: 1 })
        channel += device.channel
        redis.set(input.device, device.channel)
      }

      services.mqtt.publish(channel, '1')
      console.log(channel, '1')
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
