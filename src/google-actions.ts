import { dialogflow } from 'actions-on-google'
import services from './services'

import repositories from './repositories'
import controller from './controllers'
const controllers = controller({ services, repositories })

const assistant = dialogflow()

assistant.intent('portão batcaverna', conv => {
  controllers.mqtt.switch('ON', 1)
  setTimeout(() => {
    controllers.mqtt.switch('OFF', 1)
  }, 75)
  conv.ask('É pra já.')
})

export { assistant }
