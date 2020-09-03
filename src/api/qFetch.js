import fetch from 'node-fetch'

export async function qFetch(options, url, httpOptions, noJSON) {
  const d = new Date().getTime()

  if (!options.q[url]) {
    options.q[url] = d
  }

  let response = await fetch(url, httpOptions)

  if (options.q[url] > d) {
    throw { q: `[${options.id} old message discarded` }
  }

  if (!response.ok) {
    throw response
  }

  options.q[url] = d

  if (noJSON) return response

  return await response.json()
}
