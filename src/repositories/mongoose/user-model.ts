import { CODES } from '../../error'
import { Mongoose } from 'mongoose'
const dataloaderPlugin = require('./plugins/mongoose-plugin-dataloader.js')
const paginationPlugin = require('./plugins/mongoose-plugin-relay-pagination.js')

module.exports = (mongoose: Mongoose) => {
  const { Schema, model } = mongoose

  const schema = {
    uid: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    devicesOwned: [{
      type: mongoose.Types.ObjectId
    }],
    devicesInvited: [{
      type: mongoose.Types.ObjectId
    }]
  }
  const userSchema = new Schema(schema, { timestamps: true })

  userSchema.plugin(dataloaderPlugin, { name: 'User' })
  userSchema.plugin(paginationPlugin)

  userSchema.index({ uid: 'text' }, { unique: true })
  userSchema.index({ email: 'text' }, { unique: true })

  userSchema.statics.register = function (newUser) {
    return this.create(newUser).catch(err => {
      console.log(err)
      switch (err.code) {
        case 11000:
          throw new Error(CODES.USER_REGISTERED)
        default:
          throw err
      }
    })
  }

  userSchema.statics.getField = async function (params, field) {
    const user = await this.findOne(params, { [field]: 1 })
    if (!user) throw new Error('USER_NOT_FOUND')
    if (!user[field]) throw new Error('FIELD_NOT_FOUND')
    return user[field]
  }

  userSchema.statics.get = async function (params, projection) {
    const user = await this.findOne(params, projection)
    if (!user) throw new Error('USER_NOT_FOUND')
    return user
  }

  return model('User', userSchema)
}
