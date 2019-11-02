const DataLoaderFactory = require('./dataloader-factory')

module.exports = function (schema, { name }) {
  schema.statics.load = function (id, info) {
    return DataLoaderFactory.getInstanceBeta(this, info, name).load(id)
  }

  schema.statics.loadMany = function (ids, info) {
    return DataLoaderFactory.getInstanceBeta(this, info, name).loadMany(ids)
  }
}
