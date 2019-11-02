module.exports = ({ repositories }) => {
  const { User } = repositories.mongoose.models

  return {
    searchUsername: (username, page) => User.getPage({ ...page, params: { username: new RegExp(username, 'i') } }),

    get: (_id, field) => User.getField({ _id }, field),

    load: (id, field) => User.load(id, field),

    myDevices: async user => User.getField({ _id: user }, 'devicesOwned'),

    loadBeta: (id, info) => User.loadBeta(id, info),

    loadManyBeta: (ids, info) => User.loadManyBeta(ids, info)
  }
}
