import { Context } from '../../../apollo'
import { SendInviteInput, ResponsePayload, LogAction } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'

exports.resolver = {
  Mutation: {
    cancelInvite: async (_, { input }: Input<SendInviteInput>, { repositories, user }: Context): Promise<ResponsePayload> => {
      const { email } = input

      const device = fromGlobalId(input.device).id

      const { Device, Log } = repositories.mongoose.models

      try {
        await Device.updateOne({ _id: device, owner: user }, { $pull: { pendingInvites: email } })
        await Log.log({
          device,
          user,
          payload: email,
          action: LogAction.CancelInvite
        })
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
