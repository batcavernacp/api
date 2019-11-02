import { Context } from '../../../apollo'

exports.resolver = {
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
      subscribe: (_, params, { services, user }: Context): AsyncIterator<any> => {
        console.log(user)
        return services.pubsub.asyncIterator('SWITCHED')
      }
    }
  }
}
