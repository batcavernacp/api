import { RequestHandler, HandlerInput } from 'ask-sdk-core'
import { Response } from 'ask-sdk-model'
import { getEmail } from './auth'

const PortaoIntentHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'PortaoIntent'
  },
  async handle (handlerInput: HandlerInput): Promise<Response> {
    console.log({ handlerInput })
    const speechText = 'É pra já'

    if (handlerInput.requestEnvelope.session) {
      console.log('session', handlerInput.requestEnvelope.session)
      if (handlerInput.requestEnvelope.session.user.permissions) {
        try {
          console.log(await getEmail(handlerInput.requestEnvelope.session.user.permissions.consentToken))
        } catch (err) {
          console.log({ err })
        }
      }
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

export { PortaoIntentHandler }
