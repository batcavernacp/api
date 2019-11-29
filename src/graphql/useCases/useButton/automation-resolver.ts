import { Context } from '../../../apollo'
import { CODES } from '../../../error'
import { SwitchInput, LogAction, LigarReceptorInput } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'
import { withFilter } from 'graphql-subscriptions'

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
      const { Log } = repositories.mongoose.models
      input.device = fromGlobalId(input.device).id

      const channel = await redis.hget(input.device, 'channel')

      const test = await redis.hget(input.device, user)

      if (!test) throw new Error(CODES.UNAUTHORIZED)

      services.mqtt.publish('/' + input.turn + channel, '1')

      Log.log({
        user,
        device: input.device,
        action: input.turn === 'ON' ? LogAction.On : LogAction.Off
      })
      return true
    },
    ligarReceptor: async (_, { input }: Input<LigarReceptorInput>, { services }: Context): Promise<boolean> => {
      const { redis } = services

      const channel = await redis.hget(input.device, 'channel')

      services.mqtt.publish('/receptor' + channel, '1')

      return true
    },
    getStatus: async (_, { input }: Input<LigarReceptorInput>, { services }: Context): Promise<boolean> => {
      const { redis } = services

      const channel = await redis.hget(input.device, 'channel')

      services.mqtt.publish('/status' + channel, '1')

      return true
    }
  },

  Subscription: {
    switched: {
      resolve: ({ switched }, _, { controllers }, info) =>
        switched,

      subscribe: withFilter((_, params, { services }: Context) =>
        services.pubsub.asyncIterator('SWITCHED'),

      async ({ switched }, params, { user, services }: Context) => {
        const device = await services.redis.get(switched.device)
        const t = await services.redis.hget(device, user)
        return !!t
      })
    }
  }
}
