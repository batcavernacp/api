import { Context } from '../../../apollo'
import { RemoveUserInput, ResponsePayload } from '../../../generated/graphql'
import { Input } from '../../schema'
import { fromGlobalId } from 'graphql-relay'

exports.resolver = {
  Mutation: {
    removeUser: async (_, { input }: Input<RemoveUserInput>, { repositories, user }: Context): Promise<ResponsePayload> => {
      const { Device, User } = repositories.mongoose.models
      const device = fromGlobalId(input.device).id
      const userId = fromGlobalId(input.user).id

      try {
        await Device.updateOne({
          $and: [{ _id: device }, { owner: user }]
        }, {
          $pull: { usersInvited: userId }
        })

        await User.updateOne({
          _id: userId
        }, {
          $pull: { devicesInvited: device }
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
