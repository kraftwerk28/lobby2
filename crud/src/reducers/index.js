const initState = schema => ({
  serverUpdated: true,
  data: schema,
})

export default (schema) => (state = initState(schema), { type, data, index }) => {
  if (type === 'CHANGE_ENTRY') {
    console.log(data)
    const res = state.data.slice()
    res[index] = data
    return { ...state, data: res, serverUpdated: false }
  }
  if (type === 'SERVER_UPDATE') {
    return { ...state, serverUpdated: true }
  }
  return state
}
