module.exports = {
  async owner (next, rootUser, requires, context) {
    if (!context.user) throw new Error('U')

    if (rootUser._id != context.user) throw new Error('NOT OWNER')

    return next()
  }
}
