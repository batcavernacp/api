module.exports = {
  async auth (next, _, requires, context) {
    const { controllers, token } = context

    if (!token) throw new Error('UNAUTHENTICATED')

    context.user = await controllers.auth.verifyToken(token)

    if (!context.user) throw new Error('UNAUTHENTICATED223')

    return next()
  }
}
