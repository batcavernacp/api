import { CODES } from '../../../error'
import { Context } from '../../../apollo'
import { ResponsePayload } from '../../../generated/graphql'

exports.resolver = {
  Mutation: {
    registerWithInvite: async (_, params, { repositories, token, services }: Context): Promise<ResponsePayload> => {
      if (!token) throw new Error(CODES.UNAUTHENTICATED)

      const { Device, User } = repositories.mongoose.models
      const { firebase } = services

      try {
        const { uid, email } = await firebase.verifyIdToken(token)

        const devices = await Device.find({ pendingInvites: email }, { _id: 1, users: 1 })

        if (devices.length === 0) throw new Error(CODES.INVITE_NOT_FOUND)

        const devicesInvited = devices.map(device => device._id)

        const user = await User.register({ uid, email, devicesInvited })

        await Device.updateMany({ _id: { $in: devicesInvited } }, {
          $addToSet: { usersInvited: user._id },
          $pull: { pendingInvites: email }
        })

        return {
          success: true
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
