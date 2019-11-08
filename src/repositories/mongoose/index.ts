import { requireFolder } from '../../packages/folder-utils'
import { DeviceModel } from './device-model'
import { UserModel } from './user-model'
import { LogModel } from './log-model'
import { PageInfo } from '../../generated/graphql'
import { PageInput } from '../../graphql/schema'

const inject = mongoose => requireFolder(__dirname, '-model', { mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts', inject: mongoose })

export default inject

export interface MongooseModels {
  Device: DeviceModel;
  User: UserModel;
  Log: LogModel;
}

interface Connection {
  edges: [Edge];
  pageInfo: PageInfo;
}

interface Edge {
  cursor: string;
  node: {
    id: string;
  };
}

export interface RelayPagination<T> {
  getPage: (input: GetPageInput) => Connection;
}

interface GetPageInput extends PageInput {
  params: object;
}
