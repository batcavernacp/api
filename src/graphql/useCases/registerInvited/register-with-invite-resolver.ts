import { CODES } from '../../../error'

exports.resolver = {
  Mutation: {
    registerWithInvite: async (_, params, { repositories, token, services }) => {
      const { Device, User } = repositories.mongoose.models
      const { firebase } = services

      try {
        const { uid, email } = await firebase.verifyIdToken(token)

        const devices = await Device.find({ pendingInvites: email }, { _id: 1 })

        if (devices.length === 0) throw new Error(CODES.INVITE_NOT_FOUND)

        const devicesInvited = devices.map(device => device._id)
        const user = await User.register({ uid, email, devicesInvited })

        await Device.updateMany({ _id: { $in: devicesInvited } }, {
          $addToSet: { users: user._id },
          $pull: { pendingInvites: email }
        })

        return {
          success: true,
          user
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
