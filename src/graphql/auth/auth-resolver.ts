exports.resolver = {
  Mutation: {
    register: (_, { newUser }, { controllers, token }) => ({ user: controllers.auth.register(newUser, token) }),

    login: (_, params, { user }) => ({ user: { id: user } }),

    checkPreRegister: (_, { check }, { controllers }) => ({ available: controllers.auth.checkUsername(check.username) })
  }
}
