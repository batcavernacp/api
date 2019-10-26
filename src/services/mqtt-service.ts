import mqtt from 'mqtt'

const client = mqtt.connect(process.env.CLOUDMQTT_URL)

export default client
