import { dialogflow, Permission } from 'actions-on-google'

import { services } from './services'
import { repositories } from './repositories'

// TODO: auth with google assistant

const assistant = dialogflow()

assistant.intent('Ask Permission', conv => {
  conv.ask(new Permission({
    context: 'Test',
    permissions: ['NAME']
  }))
})

assistant.intent('abrir portão', conv => {
  console.log(conv.user)
  conv.ask('Abrindo portão.')
})

assistant.intent('fechar portão', conv => {
  conv.ask('Fechando portão.')
})

export { assistant }
