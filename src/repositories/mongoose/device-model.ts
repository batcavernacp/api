import { CODES } from '../../error'
import { Mongoose } from 'mongoose'
import jwt from 'jsonwebtoken'
const dataloaderPlugin = require('./plugins/mongoose-plugin-dataloader.js')

module.exports = (mongoose: Mongoose) => {
  const { Schema, model } = mongoose

  const schema = {
    channel: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    owner: {
      type: mongoose.Types.ObjectId
    },
    usersInvited: [{
      type: mongoose.Types.ObjectId
    }]
  }
  const deviceSchema = new Schema(schema, { timestamps: true })

  deviceSchema.plugin(dataloaderPlugin, { name: 'Device' })

  deviceSchema.index({ channel: 'text' }, { unique: true })

  deviceSchema.statics.register = function (newDevice) {
    return this.create(newDevice).catch(err => {
      console.log(err)
      switch (err.code) {
        case 11000:
          throw new Error(CODES.DEVICE_REGISTERED)
        default:
          throw err
      }
    })
  }

  deviceSchema.statics.hasOwner = async function (_id): Promise<boolean> {
    const device = await this.findOne({ _id }, { owner: 1 })
    return !!device.owner
  }

  deviceSchema.statics.getToken = function (id): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return jwt.sign({ id, type: 'Device' }, process.env.JWT_SECRET_KEY!)
  }

  return model('Device', deviceSchema)
}
