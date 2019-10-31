exports.resolver = {
  Mutation: {
    createDevice: (_, { device }, { controllers }) => ({ token: controllers.device.register(device) })
  }
}
