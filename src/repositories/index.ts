import { exportFolder } from '../packages/folder-utils'
import { MongooseModels } from './mongoose'

const repositories: Repositories = exportFolder(__dirname, '-repository', {
  mode: process.env.NODE_ENV === 'production' ? 'js' : 'ts'
})

export interface Repositories {
  mongoose: {
    models: MongooseModels;
  };
}

export { repositories }
