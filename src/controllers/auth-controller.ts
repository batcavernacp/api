module.exports = ({ repositories, services }) => {
  const { User } = repositories.mongoose.models
  const { redis, firebase } = services

  async function verifyToken (token) {
    const { uid } = await firebase.verifyIdToken(token)
    const _id = await redis.get(uid)
    if (_id) return _id

    const user = await User.get({ uid }, { _id: 1 })
    await redis.set(uid, user._id.toString())
    return user._id
  }

  return {
    verifyToken,

    verifyTokenSubscription: async token => {
      const id = await verifyToken(token)
      if (!id) throw new Error('UNAUTHENTICATED')
      return id
    }
  }
}
