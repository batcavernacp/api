import jwt from 'jsonwebtoken'
import { CODES } from '../error'

module.exports = ({ repositories, services }) => {
  const { Device, User } = repositories.mongoose.models
  const { firebase } = services

  return {
    register: async (device): Promise<any> => {
      const newDevice = await Device.register(device)
      return Device.getToken(newDevice._id)
    },

    registerUser: async ({ qrcode, name }, token): Promise<boolean> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        if (decoded.type !== 'Device') throw new Error(CODES.INVALID_TOKEN)

        if (await Device.hasOwner(decoded.id)) throw new Error(CODES.DEVICE_REGISTERED)

        const { uid, email } = await firebase.verifyIdToken(token)

        const user = await User.register({ uid, email, devicesOwned: [decoded.id] })

        await Device.updateOne({ _id: decoded.id }, { $set: { owner: user._id, name: name || '' } })

        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },

    checkQRCode: async (qrcode: string): Promise<boolean> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        switch (decoded.type) {
          case 'Device':
            if (await Device.hasOwner(decoded.id)) return false
            break

          case 'Invite':
            // TODO: check if already been used or expiration time
            break

          default:
            return false
        }

        return true
      } catch (err) {
        return false
      }
    }
  }
}
