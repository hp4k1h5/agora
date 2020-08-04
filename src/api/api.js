import fs from 'fs'
import qs from 'querystring'
import fetch from 'node-fetch'

import { shapePrices } from './shape.js'

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

export async function getQuote(sym) {
  const url = buildURL(`stock/${sym}/quote`)
  let response = await fetch(url)
  if (response.ok) {
    response = await response.json()
  } else throw response

  function clean(data) {
    data = Object.entries(data)
    const m = {
      symbol: (d) => [d[0], `${d[1]}`],
      companyName: (d) => [d[0], `{#4be-fg}${d[1]}{/}`],
      latestPrice: (d) => [d[0], `{#cc5-fg}${d[1]}{/}`],
      change: (d) => [d[0], `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${d[1]}{/}`],
      changePercent: (d) => [
        d[0],
        `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${d[1].toFixed(3)}%{/}`,
      ],
      open: (d) => [d[0], '' + d[1]],
      close: (d) => [d[0], '' + d[1]],
      high: (d) => [d[0], `{#2fe-fg}${d[1]}{/}`],
      low: (d) => [d[0], `{#a25-fg}${d[1]}{/}`],
    }
    return data.filter((d) => m[d[0]]).map((d) => m[d[0]](d))
  }

  return clean(response)
}
