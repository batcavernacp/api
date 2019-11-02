exports.resolver = {
  User: {
    email: ({ id, email }, _, { controllers }) => email || controllers.user.load(id, 'email')
  }
}
