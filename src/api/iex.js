import qs from 'querystring'
import fetch from 'node-fetch'

import {
  shapePrices,
  shapeQuote,
  shapeNews,
  shapeWatchlist,
  shapeProfile,
  shapeLists,
} from './shape.js'

import { config } from '../util/config.js'

const iexToken = config.IEX_PUB_KEY

/*
 * create a url from path: string, and params: any, a flat object that can be
 * encoded as escaped query parameters by 'querystring'. at minimum will ship
 * query with private key as urlEncoded query parameter.
 * */
export function buildIexURL(path, params = {}) {
  const baseURL = 'https://cloud.iexapis.com/stable'
  const queryString = qs.encode({ ...params, token: iexToken })

  return `${baseURL}/${path}?${queryString}`
}

export async function getPrices(options) {
  let url
  let params

  // handle indicator first which brings back chart also
  if (options.indicator) {
    params = { range: options.time, chartLast: options._time.chartLast }
    if (options.series == 'intra') {
      params.range = '1d'
    } else {
      delete params.chartLast
    }
    url = buildIexURL(
      `stock/${options.symbol}/indicator/${options.indicator}`,
      params,
    )
    // intraday
  } else if (options.series == 'intra') {
    url = buildIexURL(`stock/${options.symbol}/intraday-prices`, options._time)
  } else {
    // daily
    url = buildIexURL(`stock/${options.symbol}/chart/${options._time}`)
  }

  let response = await fetch(url)
  if (!response.ok) {
    response._errMeta = {
      url,
      params,
    }
    throw response
  }

  const data = await response.json()
  return shapePrices(options, data)
}

export async function getQuote(options) {
  const url = buildIexURL(`stock/${options.symbol}/quote`)
  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeQuote(response)
}

export async function getNews(options) {
  const url = buildIexURL(`stock/${options.symbol}/news/last/10`)
  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeNews(response)
}

export async function getWatchlist(options) {
  const url = buildIexURL('stock/market/batch', {
    symbols: options.watchlist.join(','),
    types: 'quote',
  })
  let response = await fetch(url)

  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeWatchlist(response)
}

export async function getProfile(options) {
  let urls = [
    buildIexURL(`stock/${options.symbol}/company`),
    buildIexURL(`stock/${options.symbol}/stats`),
    buildIexURL(`stock/${options.symbol}/earnings/1`, { period: 'quarter' }),
  ]

  const data = await Promise.all(
    urls.map(async (url) => {
      let response = await fetch(url)
      if (!response.ok) {
        throw response
      }

      response = await response.json()
      return response
    }),
  )

  return shapeProfile(data)
}

export async function getLists(options) {
  let urls = options.listTypes.map((t) =>
    buildIexURL(`stock/market/list/${t}`, { displayPercent: true }),
  )

  const data = await Promise.all(
    urls.map(async (url) => {
      let response = await fetch(url)
      if (!response.ok) {
        throw response
      }

      response = await response.json()
      return response
    }),
  )

  return shapeLists(data, options.listTypes)
}
