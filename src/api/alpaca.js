import qs from 'querystring'

import { config } from '../util/config.js'
import { qFetch } from './qFetch.js'
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

export async function getAccountAlpaca(options, which) {
  if (!alpacaTokens) {
    return
  }

  if (options.accountTypes) which = options.accountTypes
  else if (!which || !which.length)
    which = ['account', 'positions', 'portfolio', 'orders']

  const urls = []
  if (which.includes('account')) {
    url.push(buildAlpacaURL('GET', 'account'))
  }
  if (which.includes('positions')) {
    url.push(buildAlpacaURL('GET', 'positions'))
  }
  if (which.includes('portfolio')) {
    urls.push(
      ...[
        { period: '1D' },
        { period: '1W' },
        { period: '1M' },
        { period: '1A' },
      ].map((params) => {
        const portfolioUrl = buildAlpacaURL(
          'GET',
          'account/portfolio/history',
          params,
        )
        return portfolioUrl
      }),
    )
  }
  if (which.includes('orders')) {
    urls.push(buildAlpacaURL('GET', 'orders'))
  }

  const data = await Promise.all(
    urls.map(async (url) => {
      return await qFetch(options, url.url, url.httpOptions)
    }),
  )

  return shapeAccountAlpaca(data)
}

export async function submitOrder(ws, options, order) {
  const { url, httpOptions } = buildAlpacaURL('POST', 'orders', null, order)

  let data = await qFetch(options, url, httpOptions)

  ws.printLines(JSON.stringify(data, null, 2))
  return data
}

export async function getWatchlistAlpaca(options) {
  const { url, httpOptions } = buildAlpacaURL('GET', 'watchlists')

  let response = await qFetch(options, url, httpOptions)

  const wlNames = []
  const urls = response.map((r) => {
    wlNames.push(r.name)
    return buildAlpacaURL('GET', `watchlists/${r.id}`)
  })

  response = await Promise.all(
    urls.map(async (url) => {
      return await qFetch(options, url.url, url.httpOptions)
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
