// import fs from 'fs'
import qs from 'querystring'
import fetch from 'node-fetch'

const token = process.env.IEX_PRIVATE_KEY
if (!token || !token.length) {
  console.error('user must provide private key as env var IEX_PRIVATE_KEY')
  process.exit(1)
}

/*
 * create a url from path: string, and params: any, a flat object that can be
 * encoded as escaped query parameters by 'querystring'. at minimum will ship
 * query with private key as urlEncoded query parameter.
 * */
export function buildURL(path, params = {}) {
  const baseURL = 'https://cloud.iexapis.com/stable'
  const queryString = qs.encode({ ...params, token })

  return `${baseURL}/${path}?${queryString}`
}

/*
 * /intraday-prices endpoint returns minute-increment price data for a given stock @param sym: string
 * */
export async function getPrices(sym, params) {
  // get data
  const url = buildURL(`stock/${sym}/intraday-prices`, params)
  let response = await fetch(url)
  response = await response.json()

  // keep track of last price, which fills in for null price points
  let last = response.find((price) => price.average) || 0

  // return clean shaped data
  return response.reduce(
    (a, v) => {
      if (!v.average) {
        v.average = last.average
      }
      last = v
      a.x.push(v.minute)
      a.y.push(v.average)
      a.vol.push(v.volume)
      return a
    },
    { title: sym, x: [], y: [], vol: [] },
  )
}
