/**
 * 
 * @param {RequestInfo} url 
 * @param {RequestInit} opts 
 * @return {Promise.<Response>}
 */
const _fetch = (url, opts) => {
  const init = Object.assign({}, opts)
  if (init.method === undefined) {
    init.method = init.body === undefined ? 'GET' : 'POST'
  }
  if (init.body !== undefined) {
    init.body = JSON.stringify(init.body)
  }
  init.headers = init.headers === undefined ? {} : init.headers
  init.headers['Content-Type'] = 'application/json'
  return fetch(url, init)
}

export default _fetch
