exports.resolver = {
  Device: {
    owner: ({ owner }, _, { repositories }, info) =>
      repositories.mongoose.models.User.load(owner, info),

    users: ({ users }, _, { repositories }, info) =>
      repositories.mongoose.models.User.loadMany(users, info)
  }
}
