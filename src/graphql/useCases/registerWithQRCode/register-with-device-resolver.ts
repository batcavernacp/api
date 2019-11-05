import jwt from 'jsonwebtoken'
import { CODES } from '../../../error'
import { RegisterWithDeviceInput, ResponsePayload } from '../../../generated/graphql'
import { Context } from '../../../apollo'
import { Input } from '../../schema'

exports.resolver = {
  Mutation: {
    registerWithDevice: async (_, { input }: Input<RegisterWithDeviceInput>, { token, repositories, services }: Context): Promise<ResponsePayload> => {
      if (!token) throw new Error(CODES.UNAUTHENTICATED)

      const { qrcode, name } = input
      const { Device, User } = repositories.mongoose.models
      const { firebase } = services

      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        if (decoded.type !== 'Device') throw new Error(CODES.INVALID_TOKEN)

        if (await Device.hasOwner(decoded.id)) throw new Error(CODES.DEVICE_REGISTERED)

        const { uid, email } = await firebase.verifyIdToken(token)

        const user = await User.register({ uid, email, devicesOwned: [decoded.id] })

        await Device.updateOne({ _id: decoded.id }, { $set: { owner: user._id, name: name } })

        return { success: true }
      } catch (err) {
        return {
          success: false
          // error: err.message
        }
      }
    }
  }
}
