import { Context } from '../../apollo'

module.exports = {
  async auth (next, _, requires, context: Context) {
    const { token, services, repositories } = context

    if (!token) throw new Error('UNAUTHENTICATED')

    const { firebase, redis } = services
    const { uid } = await firebase.verifyIdToken(token)
    const _id = await redis.get(uid)

    if (_id) {
      context.user = _id
    } else {
      const { User } = repositories.mongoose.models
      const user = await User.get({ uid }, { _id: 1 })
      await redis.set(uid, user._id.toString())
      context.user = user._id
    }

    if (!context.user) throw new Error('UNAUTHENTICATED223')

    return next()
  }
}
