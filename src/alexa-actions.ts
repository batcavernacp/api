import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders
} from 'ask-sdk-core'
import {
  Response,
  SessionEndedRequest
} from 'ask-sdk-model'
import { CustomSkill } from 'ask-sdk-core/dist/skill/CustomSkill'

const LaunchRequestHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput: HandlerInput): Response {
    const speechText = 'Bem vindo a República Batcaverna!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const HelpIntentHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput: HandlerInput): Response {
    const speechText = 'O único dispositivo disponivel é o portão.'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle (handlerInput: HandlerInput): Response {
    const speechText = 'Volte sempre!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const SessionEndedRequestHandler: RequestHandler = {
  canHandle (handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput: HandlerInput): Response {
    console.log(`Session ended with reason: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`)

    return handlerInput.responseBuilder.getResponse()
  }
}

const ErrorHandlerr: ErrorHandler = {
  canHandle (handlerInput: HandlerInput, error: Error): boolean {
    return true
  },
  handle (handlerInput: HandlerInput, error: Error): Response {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Desculpe, não consegui entender. Repita por favor.')
      .reprompt('Desculpe, não consegui entender. Repita por favor.')
      .getResponse()
  }
}

function buildSkills (list: RequestHandler[]): CustomSkill {
  const skillBuilder = SkillBuilders
    . custom()
    . addRequestHandlers(
      ...list,
      LaunchRequestHandler,
      CancelAndStopIntentHandler,
      HelpIntentHandler,
      SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandlerr)

  return skillBuilder.create()
}

export { buildSkills }
