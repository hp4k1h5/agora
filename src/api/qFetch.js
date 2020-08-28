import fetch from 'node-fetch'

export async function qFetch(options, url) {
  const d = new Date().getTime()
  if (!options.d) {
    options.d = d
  }

  let response = await fetch(url)

  if (options.d > d) {
    throw { q: `[${options.id} old message discarded` }
  }

  if (!response.ok) {
    if (options.d > d) {
      throw { q: `[${options.id} old message discarded` }
    }
    throw response
  }

  options.d = d

  return await response.json()
}
