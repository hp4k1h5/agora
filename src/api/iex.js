import qs from 'querystring'
import { qFetch } from './qFetch.js'

import {
  shapePrices,
  shapeQuote,
  shapeNews,
  shapeWatchlist,
  shapeProfile,
  shapeLists,
  shapeSectors,
  shapeBook,
  shapeAccountIex,
} from '../shape/shapeIex.js'
import { config } from '../util/config.js'

const iexToken = config.IEX_PUB_KEY
const iexTokenSecret = config.IEX_SECRET_KEY

/*
 * create a url from path: string, and params: any, a flat object that can be
 * encoded as escaped query parameters by 'querystring'. at minimum will ship
 * query with private key as urlEncoded query parameter.
 * */
export function buildIexURL(path, params = {}, token = iexToken) {
  const baseURL = 'https://cloud.iexapis.com/stable'
  const queryString = qs.encode({ ...params, token })

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
    if (options.indicator.defaults) {
      options.indicator.defaults.forEach((d, i) => {
        params['input' + (i + 1)] = d * 1.5
      })
    }

    url = buildIexURL(
      `stock/${options.symbol}/indicator/${options.indicator.name}`,
      params,
    )
    // intraday
  } else if (options.series == 'intra') {
    url = buildIexURL(`stock/${options.symbol}/intraday-prices`, options._time)
  } else {
    // daily
    url = buildIexURL(`stock/${options.symbol}/chart/${options._time}`)
  }

  const data = await qFetch(options, url)

  return shapePrices(options, data)
}

export async function getQuote(options) {
  const url = buildIexURL(`stock/${options.symbol}/quote`)
  const data = await qFetch(options, url)

  return shapeQuote(data)
}

export async function getNews(options) {
  const url = buildIexURL(`stock/${options.symbol}/news/last/10`)
  const data = await qFetch(options, url)

  return shapeNews(data)
}

export async function getWatchlistIex(options) {
  const url = buildIexURL('stock/market/batch', {
    symbols: options.watchlist.join(','),
    types: 'quote',
  })

  const data = await qFetch(options, url)

  return shapeWatchlist(data)
}

export async function getProfile(options) {
  let urls = [
    buildIexURL(`stock/${options.symbol}/company`),
    buildIexURL(`stock/${options.symbol}/stats`),
    buildIexURL(`stock/${options.symbol}/earnings/1`, { period: 'quarter' }),
    buildIexURL(`stock/${options.symbol}/financials`),
  ]

  const data = await Promise.all(
    urls.map(async (url) => {
      return await qFetch(options, url)
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
      return await qFetch(options, url)
    }),
  )

  return shapeLists(data, options.listTypes)
}

export async function getSectors(options) {
  const url = buildIexURL('stock/market/sector-performance')

  const data = await qFetch(options, url)

  return shapeSectors(data)
}

export async function getBook(options) {
  const url = buildIexURL(`stock/${options.symbol}/book`)

  const data = await qFetch(options, url)

  return shapeBook(data)
}

export async function getAccountIex(options) {
  if (!iexTokenSecret || !iexTokenSecret.length) {
    return
  }

  const url = buildIexURL('account/usage', {}, iexTokenSecret)

  const data = await qFetch(options, url)

  return shapeAccountIex(data)
}
