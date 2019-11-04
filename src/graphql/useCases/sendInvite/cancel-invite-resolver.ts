import { Context } from '../../../apollo'
import { SendInviteInput } from '../../../generated/graphql'
import { CODES } from '../../../error'

interface SendInviteInputA {
  input: SendInviteInput;
}

exports.resolver = {
  Mutation: {
    cancelInvite: async (_, { input }: SendInviteInputA, { repositories, user }: Context) => {
      const { device, email } = input
      const { Device } = repositories.mongoose.models

      try {
        const dev = await Device.updateOne({ _id: device, owner: user }, { $pull: { pendingInvites: email } }, { new: true })
        console.log(dev)
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
