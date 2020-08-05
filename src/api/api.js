import qs from 'querystring'
import fetch from 'node-fetch'

import { shapePrices, shapeQuote } from './shape.js'

const token = process.env.IEX_PUB_KEY
if (!token || !token.length) {
  console.error(`user must provide publishable key as env var IEX_PUB_KEY
    see README to learn how to obtain one. e.g.     
    export IEX_PUB_KEY=pk_your_Publishable_iex_api_key`)
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
export async function getPrices(ws, c) {
  let url
  // intraday
  if (c.series == 'intra') {
    url = buildURL(`stock/${c.symbol}/intraday-prices`, c._time)
  } else {
    // daily
    url = buildURL(`stock/${c.symbol}/chart/${c._time}`)
  }

  let response = await fetch(url)
  if (response.ok) {
    const data = await response.json()

    return shapePrices(c, data)
  }

  ws.printLines(response.statusText)
}

export async function getQuote(symbol) {
  const url = buildURL(`stock/${symbol}/quote`)
  let response = await fetch(url)
  if (response.ok) {
    response = await response.json()
  } else throw response

  return shapeQuote(response)
}
