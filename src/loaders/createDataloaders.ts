import { Repositories } from '~/repositories'
import Dataloader from 'dataloader'
import { LogDocument } from '~/repositories/mongoose/log-model'
import { UserDocument } from '~/repositories/mongoose/user-model'
import { DeviceDocument } from '~/repositories/mongoose/device-model'

export function createDataloaders (repositories: Repositories): Loaders {
  const { Log, User, Device } = repositories.mongoose.models

  function Loader<T> (model): Dataloader<string, T[]> {
    return new Dataloader(async ids => (
      await model.find({ _id: { $in: ids } })
    ).sort((a, b) =>
      ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString())
    ),
    {
      cacheKeyFn: key => key.toString()
    })
  }

  return {
    logs: Loader<LogDocument>(Log),

    users: Loader<UserDocument>(User),

    devices: Loader<DeviceDocument>(Device)
  }
}

export interface Loaders {
  logs: Dataloader<string, any>;
  users: Dataloader<string, any>;
  devices: Dataloader<string, any>;
}
