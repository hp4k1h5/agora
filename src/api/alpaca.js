import fetch from 'node-fetch'
import qs from 'querystring'

import { config } from '../util/config.js'
import { getWatchlistIex } from './iex.js'
import { shapeAccountAlpaca } from '../shape/shapeAlpaca.js'

let alpacaTokens
if (config['APCA_API_KEY_ID'] && config['APCA_API_KEY_ID'].length) {
  alpacaTokens = {
    'APCA-API-KEY-ID': config['APCA_API_KEY_ID'],
    'APCA-API-SECRET-KEY': config['APCA_API_SECRET_KEY'],
  }
}

const baseURLs = {
  paper: 'https://paper-api.alpaca.markets/v2',
  live: 'https://api.alpaca.markets/v2',
}
const baseURL = baseURLs[config.alpacaAccountType]

export function buildAlpacaURL(method, path, params, body) {
  const queryString = qs.encode(params)
  const url = `${baseURL}/${path}?${queryString}`

  const httpOptions = {
    method,
    headers: alpacaTokens,
  }

  if (body) {
    httpOptions.body = JSON.stringify(body)
    httpOptions.headers['Content-Type'] = 'application/json'
  }

  return { url, httpOptions }
}

export async function getAccountAlpaca() {
  if (!alpacaTokens) {
    return
  }

  const { url: accountUrl, httpOptions } = buildAlpacaURL('GET', 'account')
  const { url: positionsUrl } = buildAlpacaURL('GET', 'positions')
  const portfolioUrls = [
    { period: '1D' },
    { period: '1W' },
    { period: '1M' },
    { period: '1A' },
  ].map((params) => {
    const { url: portfolioUrl } = buildAlpacaURL(
      'GET',
      'account/portfolio/history',
      params,
    )
    return portfolioUrl
  })

  const urls = [accountUrl, positionsUrl, ...portfolioUrls]

  const data = await Promise.all(
    urls.map(async (url) => {
      let response = await fetch(url, httpOptions)
      if (!response.ok) {
        throw response
      }

      response = await response.json()
      return response
    }),
  )

  return shapeAccountAlpaca(data)
}

export async function submitOrder(ws, order) {
  order.time_in_force = 'day'
  order.type = 'market'
  const { url, httpOptions } = buildAlpacaURL('orders', 'POST', null, order)

  let response = await fetch(url, httpOptions)
  if (!response.ok) {
    throw response
  }

  response = await response.json()

  ws.printLines(JSON.stringify(response, null, 2))
  return
}

export async function getWatchlistAlpaca(options) {
  const { url, httpOptions } = buildAlpacaURL('GET', 'watchlists')

  let response = await fetch(url, httpOptions)
  if (!response.ok) {
    throw response
  }
  response = await response.json()

  const wlNames = []
  const urls = response.map((r) => {
    wlNames.push(r.name)
    return buildAlpacaURL('GET', `watchlists/${r.id}`)
  })

  response = await Promise.all(
    urls.map(async (url) => {
      let r = await fetch(url.url, url.httpOptions)
      if (!r.ok) {
        throw r
      }
      return await r.json()
    }),
  )

  response = await Promise.all(
    response.map(async (wl) => {
      options.watchlist = wl.assets.map((a) => a.symbol)
      return await getWatchlistIex(options)
    }),
  )

  return response.reduce((a, v, i) => {
    let line = v[0].map(() => '--')
    line[1] = wlNames[i]
    v.unshift(line)
    return [...a, ...v]
  }, [])
}
