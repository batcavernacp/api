import { Context } from '../../../apollo'
import { RemoveUserInput, ResponsePayload } from '../../../generated/graphql'
import { Input } from '../../schema'

exports.resolver = {
  Mutation: {
    removeUser: async (_, { input }: Input<RemoveUserInput>, { repositories, user }: Context): Promise<ResponsePayload> => {
      const { Device, User } = repositories.mongoose.models
      try {
        await Device.updateOne({
          $and: [{ _id: input.device }, { owner: user }]
        }, {
          $pull: { usersInvited: input.user }
        })

        await User.updateOne({
          _id: input.user
        }, {
          $pull: { devicesInvited: input.device }
        })
      } catch (err) {

      }

      return {
        success: false
      }
    }
  }
}
