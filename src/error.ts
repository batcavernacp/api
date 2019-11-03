import { GraphQLError } from 'graphql'

const CODES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NOT_OWNER: 'NOT_OWNER',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_ID: 'INVALID_ID',
  USER_REGISTERED: 'USER_REGISTERED',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  DEVICE_REGISTERED: 'DEVICE_REGISTERED',
  INVITE_NOT_FOUND: 'INVITE_NOT_FOUND'
}

function formatError (err: GraphQLError) {
  if (CODES[err.message]) {
    return {
      message: CODES[err.message],
      code: CODES[err.message]
    }
  } else {
    if (process.env.NODE_ENV != 'production') console.log(err.extensions!.exception.stacktrace)
    return {
      message: CODES.UNKNOWN_ERROR
    }
  }
}

export {
  CODES, formatError
}
