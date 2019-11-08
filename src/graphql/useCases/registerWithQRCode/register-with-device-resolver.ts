import jwt from 'jsonwebtoken'
import { CODES } from '../../../error'
import { RegisterWithDeviceInput, RegisterUserPayload } from '../../../generated/graphql'
import { Context } from '../../../apollo'
import { Input } from '../../schema'
import { UserDocument } from '../../../repositories/mongoose/user-model'

exports.resolver = {
  RegisterUserPayload: {
    user: ({ user }: RegisterUserPayload, _, { loaders }: Context): Promise<UserDocument> | null =>
      user ? loaders.users.load(user.id) : null
  },

  Mutation: {
    registerWithDevice: async (_, { input }: Input<RegisterWithDeviceInput>, { token, repositories, services }: Context): Promise<RegisterUserPayload> => {
      if (!token) throw new Error(CODES.UNAUTHENTICATED)

      const { qrcode, name } = input
      const { Device, User } = repositories.mongoose.models
      const { firebase, redis } = services

      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        if (decoded.type !== 'Device') throw new Error(CODES.INVALID_TOKEN)

        const device = await Device.findOne({ _id: decoded.id }, { owner: 1, channel: 1 })

        if (!device) throw new Error(CODES.NOT_FOUND)

        if (device.owner) throw new Error(CODES.DEVICE_REGISTERED)

        const { uid, email } = await firebase.verifyIdToken(token)

        const user = await User.register({ uid, email, devicesOwned: [decoded.id] })

        await Device.updateOne({ _id: decoded.id }, { $set: { owner: user._id, name: name } })

        redis.hset(decoded.id, 'channel', device.channel)
        redis.hset(decoded.id, user._id.toString(), 1)

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
