import { CODES } from '../../../error'
import { Context } from '../../../apollo'
import { RegisterUserPayload } from '../../../generated/graphql'

exports.resolver = {
  Mutation: {
    registerWithInvite: async (_, params, { repositories, token, services }: Context): Promise<RegisterUserPayload> => {
      if (!token) throw new Error(CODES.UNAUTHENTICATED)

      const { Device, User } = repositories.mongoose.models
      const { firebase, redis } = services

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

        devicesInvited.forEach(device => {
          redis.hset(device, user._id.toString(), 1)
        })

        return {
          success: true,
          user: { id: user._id }
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
