const initState = schema => ({
  serverUpdated: true,
  data: schema,
});

const schemaTemplate = () => ({
  text: null,
  to: null,
  githubUrl: null,
  npmUrl: null,
  siteUrl: null,
  youtubeUrl: null,
  readme: null,
  group: null,
});

export default (schema) => (state = initState(schema), { type, data, index }) => {
  if (type === 'CHANGE_ENTRY') {
    const res = state.data.slice();
    res[index] = data;
    return { ...state, data: res, serverUpdated: false };
  }
  if (type === 'ADD_ENTRY') {
    return {
      ...state,
      data: [...state.data, schemaTemplate()],
      serverUpdated: false
    };
  }
  if (type === 'REMOVE_ENTRY') {
    const newData = state.data.slice();
    newData.splice(index, 1);
    return { ...state, data: newData, serverUpdated: false };
  }
  if (type === 'SERVER_UPDATE') {
    return { ...state, serverUpdated: true };
  }
  return state;
};
