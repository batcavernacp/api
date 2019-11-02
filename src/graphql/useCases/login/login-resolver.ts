import { LoginPayload } from '../../../generated/graphql'

exports.resolver = {
  Mutation: {
    login: (_, params, { user }): LoginPayload => ({ user: { id: user } })
  }
}
