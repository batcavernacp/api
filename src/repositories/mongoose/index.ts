import { requireFolder } from '../../packages/folder-utils'
import { DeviceModel } from './device-model'
import { UserModel } from './user-model'
// import {  } from 'mongodb'

const inject = mongoose => requireFolder(__dirname, '-model', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts', inject: mongoose })

export default inject

export interface MongooseModels {
  Device: DeviceModel;
  User: UserModel;
}

export interface Loader<T> {
  load: (id: string, info: any) => Promise<T>;
  loadMany: (ids: [string], info: any) => Promise<[T]>;
}
