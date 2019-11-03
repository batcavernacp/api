import { CODES } from '../../../error'
import { ResponsePayload } from '../../../generated/graphql'
import { Context } from '../../../apollo'

exports.resolver = {
  Mutation: {
    checkEmail: async (_, { input }, { repositories }: Context): Promise<ResponsePayload> => {
      const { email } = input
      const { Device } = repositories.mongoose.models

      try {
        const devices = await Device.find({ pendingInvites: email }, { _id: 1 })
        if (devices.length === 0) throw new Error(CODES.INVITE_NOT_FOUND)
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    }
  }
}
