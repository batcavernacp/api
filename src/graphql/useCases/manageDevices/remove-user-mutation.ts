import { Context } from '../../../apollo'
import { RemoveUserInput, ResponsePayload, LogAction } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'
import { CODES } from '../../../error'

exports.resolver = {
  Mutation: {
    removeUser: async (_, { input }: Input<RemoveUserInput>, { repositories, user, services }: Context): Promise<ResponsePayload> => {
      const { Device, User, Log } = repositories.mongoose.models
      const { redis } = services
      const device = fromGlobalId(input.device).id
      const userId = fromGlobalId(input.user).id

      try {
        const removedUser = await User.findOne({ _id: userId, devicesInvited: device }, { email: 1 })

        if (!removedUser) {
          throw new Error(CODES.NOT_FOUND)
        }

        await Device.updateOne({
          $and: [{ _id: device }, { owner: user }]
        }, {
          $pull: { usersInvited: userId }
        })

        await User.updateOne({
          _id: userId
        }, {
          $pull: { devicesInvited: device }
        }, { new: true, projection: { email: 1 } })

        await redis.hdel(device, userId)

        await Log.log({
          action: LogAction.RemoveUser,
          device,
          user,
          payload: removedUser.email
        })
        return {
          success: true
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
