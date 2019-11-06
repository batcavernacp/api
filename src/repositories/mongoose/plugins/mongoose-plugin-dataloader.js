const DataLoaderFactory = require('./dataloader-factory')

module.exports = function (schema, { name }) {
  schema.statics.load = function (id, info) {
    return DataLoaderFactory.getInstance(this, info, name).load(id.toString())
  }

  schema.statics.loadMany = function (ids, info) {
    return DataLoaderFactory.getInstance(this, info, name).loadMany(ids.map(id => id.toString()))
  }
}
