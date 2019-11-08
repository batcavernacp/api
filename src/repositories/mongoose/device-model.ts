import { CODES } from '../../error'
import { Mongoose, Document, Model } from 'mongoose'
import jwt from 'jsonwebtoken'

export interface DeviceDocument extends Document {
  channel: string;
  name: string;
  owner: string;
  usersInvited: [string];
  pendingInvites: [string];
}

export interface DeviceModel extends Model<DeviceDocument> {
  register: (channel: string) => DeviceDocument;
  hasOwner: (_id: string) => Promise<boolean>;
  getToken: (id: string) => string;
}

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
    }],
    pendingInvites: [{
      type: String
    }]
  }
  const deviceSchema = new Schema(schema, { timestamps: true })

  deviceSchema.index({ channel: 'text' }, { unique: true })

  deviceSchema.statics.register = function (channel) {
    return this.create({ channel }).catch(err => {
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
