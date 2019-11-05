import { LoginPayload } from '../../../generated/graphql'
import { Context } from '../../../apollo'

exports.resolver = {
  Mutation: {
    login: (_, params, { user }: Context): LoginPayload => ({
      user: { id: user }
    })
  }
}
