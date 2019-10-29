import { dialogflow } from 'actions-on-google'
import services from './services'

import repositories from './repositories'
import controller from './controllers'
const controllers = controller({ services, repositories })

const assistant = dialogflow()

function portao () {
  if (process.env.DEBUG_DIALOGFLOW) {
    console.log('portao')
    return
  }
  controllers.mqtt.switch('ON', 1)
  setTimeout(() => {
    controllers.mqtt.switch('OFF', 1)
  }, 75)
}

assistant.intent('abrir portão', conv => {
  portao()
  conv.ask('Abrindo portão.')
})

assistant.intent('fechar portão', conv => {
  portao()
  conv.ask('Fechando portão.')
})

export { assistant }
