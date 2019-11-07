import { Context } from '../../../apollo'
import { SendInviteInput, SendInvitePayload, LogAction } from '../../../generated/graphql'
import { CODES } from '../../../error'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'

exports.resolver = {
  SendInvitePayload: {
    user: ({ user }: SendInvitePayload, _, { repositories }: Context, info) =>
      user ? repositories.mongoose.models.User.load(user.id, info) : null
  },
  Mutation: {
    sendInvite: async (_, { input }: Input<SendInviteInput>, { repositories, user }: Context): Promise<SendInvitePayload> => {
      const { email } = input

      const device = fromGlobalId(input.device).id
      // check type

      const { Device, User, Log } = repositories.mongoose.models
      const dev = await Device.findOne({ _id: device, owner: user }, { _id: 1 })

      if (!dev) throw new Error(CODES.UNAUTHORIZED)

      try {
        const userInvited = await User.findOne({ email }, { _id: 1, devicesInvited: 1 }, { _id: 1, email: 1 })
        if (!userInvited) {
          await Device.updateOne({ _id: device }, { $addToSet: { pendingInvites: email } })
          await Log.log({
            device,
            user,
            payload: email,
            action: LogAction.InviteUser
          })
          return {
            success: true
          }
        } else {
          await Device.updateOne({ _id: device }, { $addToSet: { usersInvited: userInvited._id } })
          await User.updateOne({ _id: userInvited._id }, { $addToSet: { devicesInvited: device } })
          await Log.log({
            device,
            user,
            payload: email,
            action: LogAction.InviteUser
          })
          return {
            success: true,
            user: { id: userInvited._id }
          }
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    }
  }
}
