exports.resolver = {
  Device: {
    owner: ({ owner }, _, { controllers }, info) =>
      controllers.user.loadBeta(owner, info),

    users: ({ users }, _, { controllers }, info) =>
      controllers.user.loadManyBeta(users, info)
  },
  Mutation: {
    registerWithDevice: (_, { input }, { token, controllers }) => ({
      success: controllers.device.registerUser(input, token)
    }),

    checkQRCode: (_, { input }, { controllers }) => ({
      success: controllers.device.checkQRCode(input.qrcode)
    })
  }
}
