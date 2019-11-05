import { Context } from '../../../apollo'
import { SendInviteInput, SendInvitePayload } from '../../../generated/graphql'
import { CODES } from '../../../error'
import { Input } from '../../schema'

exports.resolver = {
  SendInvitePayload: {
    user: ({ user }: SendInvitePayload, _, { repositories }: Context, info) =>
      user ? repositories.mongoose.models.User.load(user.id, info) : null
  },
  Mutation: {
    sendInvite: async (_, { input }: Input<SendInviteInput>, { repositories, user }: Context): Promise<SendInvitePayload> => {
      const { device, email } = input
      const { Device, User } = repositories.mongoose.models

      const dev = await Device.findOne({ _id: device, owner: user }, { _id: 1 })

      if (!dev) throw new Error(CODES.UNAUTHORIZED)

      try {
        const user = await User.findOne({ email }, { _id: 1, devicesInvited: 1 }, { _id: 1 })
        if (!user) {
          await Device.updateOne({ _id: device }, { $addToSet: { pendingInvites: email } })
          return {
            success: true
          }
        } else {
          await Device.updateOne({ _id: device }, { $addToSet: { usersInvited: user._id } })
          await User.updateOne({ _id: user._id }, { $addToSet: { devicesInvited: device } })
          return {
            success: true,
            user: { id: user._id }
          }
        }
      } catch (err) {
        console.log(err)
        return {
          success: false
        }
      }
    }
  }
}
