import fs from 'fs'
import qs from 'querystring'
import fetch from 'node-fetch'

const token = process.env.IEX_PUB_KEY
if (!token || !token.length) {
  console.error(`user must provide publishable key as env var IEX_PUB_KEY
    see README to learn how to obtain one.
    ex. export IEX_PUB_KEY=pk_your_Publishable_iex_api_key`)
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
export async function getPrices(self) {
  let url

  // intraday
  if (self.series == 'intra') {
    url = buildURL(`stock/${self.sym}/intraday-prices`, self.time)
  } else {
    url = buildURL(`stock/${self.sym}/chart/${self.time}`)
  }
  let response = await fetch(url)
  if (response.ok) {
    response = await response.json()
  } else throw response

  // keep track of last price, which fills in for null price points
  let last = response.find((price) => price.close) || 0

  // return clean shaped data
  return response.reduce(
    (a, v) => {
      if (!v.close) {
        v.close = last.close
      }
      // update last
      last = v
      a.x.push(self.series == 'intra' ? v.minute : v.date)
      a.y.push(v.close)
      a.vol.push(v.volume)
      return a
    },
    { title: self.sym, x: [], y: [], vol: [] },
  )
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
