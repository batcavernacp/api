import { ObjectId } from 'bson'

exports.resolver = {
  Device: {
    owner: ({ _doc }, _, { repositories }, info) =>
      repositories.mongoose.models.User.load(_doc.owner, info),

    users: ({ _doc }, _, { repositories }, info) =>
      repositories.mongoose.models.User.loadMany(_doc.users, info)
  }
}
