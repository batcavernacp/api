module.exports = ({ services }) => {
  const { mqtt, pubsub } = services

  mqtt.on('connect', () => {
    mqtt.subscribe('#')
  })

  mqtt.on('message', function (topic, msg, pkt) {
    if (!topic.includes('turned')) return

    const value = JSON.parse(msg)
    console.log({ topic, value })

    pubsub.publish('SWITCHED', {
      switched: {
        turned: topic === 'turnedOn' ? 'ON' : 'OFF',
        relay: value
      }
    })
  })
}
