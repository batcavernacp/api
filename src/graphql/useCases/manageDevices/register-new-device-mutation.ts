import { Context } from '../../../apollo'
import { RegisterNewDeviceInput, RegisterNewDevicePayload } from '../../../generated/graphql'
import { Input } from '../../schema'
import jwt from 'jsonwebtoken'
import { CODES } from '../../../error'
import { DeviceDocument } from '../../../repositories/mongoose/device-model'

exports.resolver = {
  RegisterNewDevicePayload: {
    device: ({ device }: RegisterNewDevicePayload, _, { loaders }: Context, info): Promise<DeviceDocument> | null =>
      device ? loaders.devices.load(device.id) : null
  },

  Mutation: {
    registerNewDevice: async (_, { input }: Input<RegisterNewDeviceInput>, { repositories, user }: Context): Promise<RegisterNewDevicePayload> => {
      const { qrcode, name } = input
      const { Device, User } = repositories.mongoose.models

      try {
        const decoded: any = jwt.verify(qrcode, process.env.JWT_SECRET_KEY!)

        if (decoded.type !== 'Device') throw new Error(CODES.INVALID_TOKEN)

        const device = await Device.findOne({ _id: decoded.id }, { _id: 1, owner: 1 })

        if (!device) throw new Error(CODES.NOT_FOUND)

        if (device.owner) throw new Error(CODES.DEVICE_REGISTERED)

        await User.updateOne({ _id: user }, { $addToSet: { devicesOwned: decoded.id } })

        await Device.updateOne({ _id: decoded.id }, { $set: { owner: user, name } })

        return {
          success: true,
          device: { id: decoded.id }
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
