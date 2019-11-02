import jwt from 'jsonwebtoken'
import { CODES } from '../../../error'

exports.resolver = {
  Mutation: {
    checkQRCode: async (_, { input }, { repositories }) => {
      const { qrcode } = input
      const { Device } = repositories.mongoose.models
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        switch (decoded.type) {
          case 'Device':
            if (await Device.hasOwner(decoded.id)) throw new Error(CODES.DEVICE_REGISTERED)
            break

          case 'Invite':
            throw new Error('not implemented yet')

          default:
            throw new Error(CODES.INVALID_TOKEN)
        }

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
