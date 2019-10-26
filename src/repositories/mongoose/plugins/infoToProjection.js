module.exports = info => {
  const { fieldNodes, fragments } = info

  projection = {}

  if (!fieldNodes[0].selectionSet) return info

  fieldNodes[0].selectionSet.selections.map(
    ({ name: { value } }) => (projection[value] = 1)
  )

  Object.values(fragments).map(({ selectionSet }) => selectionSet.selections.map(
    ({ name: { value } }) => (projection[value] = 1)
  ))

  return projection
}
