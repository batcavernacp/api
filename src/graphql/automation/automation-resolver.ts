exports.resolver = {
  Mutation: {
    switch: (_, { input }, { controllers }) => controllers.mqtt.switch(input.turn, input.relay)
  },
  Subscription: {
    switched: {
      subscribe: (_, params, { controllers, user }) => {
        console.log(user)
        return controllers.mqtt.switchedSubscription()
      }
    }
  }
}
