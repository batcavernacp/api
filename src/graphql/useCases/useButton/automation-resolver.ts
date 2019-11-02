import { Context } from '../../../apollo'

exports.resolver = {
  Mutation: {
    switch: (_, { input }, { services }): boolean => {
      const { turn, relay } = input
      services.mqtt.publish('/' + turn, relay.toString())
      console.log('/' + turn, relay.toString())
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
