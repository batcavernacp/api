import { Context } from '../../../apollo'
import { CODES } from '../../../error'
import { SwitchInput, LogAction } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'
import { withFilter } from 'graphql-subscriptions'
import { RequestHandler, HandlerInput } from 'ask-sdk-core'
import { Response } from 'ask-sdk-model'

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
      input.device = fromGlobalId(input.device).id

      let channel = '/' + input.turn
      let topic = await redis.hget(input.device, 'channel')

      if (!topic) {
        const device = await Device.findOne({ _id: input.device }, { channel: 1 })
        if (!device) throw new Error(CODES.NOT_FOUND)
        topic = device.channel
        // console.log({ id: input.device, channel: device.channel })
        redis.hset(input.device, 'channel', device.channel)
      }

      const test = await redis.hget(input.device, user)

      if (!test) throw new Error(CODES.UNAUTHORIZED)

      channel += topic

      services.mqtt.publish(channel, '1')

      Log.log({
        user,
        device: input.device,
        action: input.turn === 'ON' ? LogAction.On : LogAction.Off
      })
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

const PortaoIntentHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PortaoIntent'
  },
  handle (handlerInput: HandlerInput): Response {
    console.log({ handlerInput })
    const speechText = 'É pra já'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

export { PortaoIntentHandler }
