const ObjectId = require('mongodb').ObjectID
const { fromGlobalId } = require('graphql-relay')

module.exports = function (schema) {
  schema.statics.getPage = async function ({ first, after, last, before, params = {} }) {
    let edges
    let hasNextPage
    let hasPreviousPage
    let sort
    let size
    if (first) {
      sort = 1
      size = first
      if (after) {
        after = fromGlobalId(after).id
        params = { _id: { $gt: ObjectId(after) }, ...params }
      }
      edges = await this.find(params, { _id: 1 })
        .sort({ _id: sort })
        .limit(size)
      hasNextPage = edges.length === first
      hasPreviousPage = false
    } else if (last) {
      sort = -1
      size = last
      if (before) {
        before = fromGlobalId(before).id
        params = { _id: { $lt: ObjectId(before) }, ...params }
      }
      edges = await this.find(params, { _id: 1 })
        .sort({ _id: sort })
        .limit(size)
      hasNextPage = false
      hasPreviousPage = edges.length === last
    } else {
      throw new Error('wrong query')
    }

    return {
      edges: edges.map(({ _doc: { _id } }) => ({ id: _id })),
      pageInfo: {
        hasNextPage,
        hasPreviousPage
      }
    }
  }
}
