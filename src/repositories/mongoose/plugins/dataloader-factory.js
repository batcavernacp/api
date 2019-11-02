const DataLoader = require('dataloader')
const ObjectId = require('mongodb').ObjectID
const infoToProjection = require('./infoToProjection')

const DataLoaderFactory = (function () {
  function Loader (model, field) {
    return new DataLoader(ids => model.find({ _id: { $in: ids.map(id => ObjectId(id)) } }, { [field]: 1 }))
  }
  function LoaderBeta (model, projection) {
    return new DataLoader(ids => model.find({ _id: { $in: ids.map(id => ObjectId(id)) } }, projection))
  }
  const instance = {}
  return {
    getInstance: function (model, field, name) {
      const key = name + field
      if (!instance[key]) {
        instance[key] = new Loader(model, field)
        delete instance[key].constructor
      }
      return instance[key]
    },
    getInstanceBeta: function (model, info, name) {
      const projection = infoToProjection(info)
      const key = name + JSON.stringify(projection)
      if (!instance[key]) {
        instance[key] = new LoaderBeta(model, projection)
        delete instance[key].constructor
      }
      return instance[key]
    }
  }
})()

module.exports = DataLoaderFactory
