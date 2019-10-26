const DataLoaderFactory = require('./dataloader-factory')

module.exports = function (schema, { name }) {
  schema.statics.load = async function (id, field) {
    const loaded = await DataLoaderFactory.getInstance(this, field, name).load(id)
    return loaded[field]
  }

  schema.statics.loadBeta = function (id, info) {
    return DataLoaderFactory.getInstanceBeta(this, info, name).load(id)
  }

  // schema.statics.loadMany = function (ids) {
  //   return Loader(this).loadMany(ids)
  // }
}