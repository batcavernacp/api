module.exports = ({ services }) => {
  const { mqtt, pubsub } = services

  mqtt.on('connect', () => {
    mqtt.subscribe('turnedOn')
    mqtt.subscribe('turnedOff')
  })

  mqtt.on('message', function (topic, msg, pkt) {
    const value = JSON.parse(msg)
    pubsub.publish('SWITCHED', {
      switched: {
        turned: topic == 'turnedOn' ? 'ON' : 'OFF',
        relay: value
      }
    })
  })

  return {
    switch: async (turn, relay) => {
      mqtt.publish('/' + turn, relay.toString())
      console.log('/' + turn, relay.toString())
      return true
    },

    switchedSubscription: () => pubsub.asyncIterator('SWITCHED')
  }
}
