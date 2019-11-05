import { Context } from '../../../apollo'
import { SendInviteInput, ResponsePayload } from '../../../generated/graphql'
import { Input } from '../../schema'

exports.resolver = {
  Mutation: {
    cancelInvite: async (_, { input }: Input<SendInviteInput>, { repositories, user }: Context): Promise<ResponsePayload> => {
      const { device, email } = input
      const { Device } = repositories.mongoose.models

      try {
        await Device.updateOne({ _id: device, owner: user }, { $pull: { pendingInvites: email } }, { new: true })

        return { success: true }
      } catch (err) {
        console.log(err)
        return {
          success: false,
          error: err.message
        }
      }
    }
  }
}
