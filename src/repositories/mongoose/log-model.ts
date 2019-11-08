import { Mongoose, Document, Model } from 'mongoose'
import { RelayPagination } from '.'
import { LogAction } from '../../generated/graphql'
const paginationPlugin = require('./plugins/mongoose-plugin-relay-pagination.js')

interface Log {
  device: string;
  user: string;
  action: LogAction;
  payload?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogDocument extends Document {
}

export interface LogModel extends Model<LogDocument>, RelayPagination<LogDocument>{
  log: (log: Log) => Promise<LogDocument>;
}

module.exports = (mongoose: Mongoose) => {
  const { Schema, model, Types } = mongoose

  const schema = {
    device: Types.ObjectId,
    user: Types.ObjectId,
    action: String,
    payload: String
  }
  const logSchema = new Schema(schema, { timestamps: true })

  logSchema.plugin(paginationPlugin, 'Log')

  logSchema.index({ device: 1 })

  logSchema.statics.log = function (log: Log): Promise<LogDocument> {
    return this.create(log)
  }

  return model('Log', logSchema)
}
