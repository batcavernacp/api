const DataLoader = require('dataloader')
const ObjectId = require('mongodb').ObjectID
const infoToProjection = require('./infoToProjection')

const DataLoaderFactory = (function () {
  function Loader (model, projection) {
    return new DataLoader(async ids => (
      await model.find({ _id: { $in: ids.map(id => ObjectId(id)) } }, projection)
    ).sort((a, b) =>
      ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString())
    ),
    {
      cacheKeyFn: key => key.toString()
    })
  }
  const instance = {}
  return {
    getInstance: function (model, info, name) {
      const projection = infoToProjection(info)
      const key = name + JSON.stringify(projection)
      if (!instance[key]) {
        instance[key] = new Loader(model, projection)
        delete instance[key].constructor
      }
      return instance[key]
    }
  }
})()

module.exports = DataLoaderFactory
