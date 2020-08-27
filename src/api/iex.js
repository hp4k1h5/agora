import qs from 'querystring'
import fetch from 'node-fetch'

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
// import { handleErr } from '../util/error.js'
import { msgQ } from '../ui/update.js'
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

export async function getWatchlistIex(options) {
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
    buildIexURL(`stock/${options.symbol}/financials`),
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

export async function getSectors(_options) {
  let url = buildIexURL('stock/market/sector-performance')

  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeSectors(response)
}

export async function getBook(options) {
  const url = buildIexURL(`stock/${options.symbol}/book`)

  async function qFetch(options, url) {
    const d = new Date().getTime()

    let response = await fetch(url)
    if (!response.ok) {
      throw response
    }

    if (msgQ[options.id] > d) {
      throw `[${options.id} old message discarded`
    }

    msgQ[options.id] = d

    return await response.json()
  }

  let response = await qFetch(options, url)

  return shapeBook(response)
}

export async function getAccountIex() {
  if (!iexTokenSecret || !iexTokenSecret.length) {
    return
  }

  const url = buildIexURL('account/usage', {}, iexTokenSecret)

  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  const data = await response.json()
  return shapeAccountIex(data)
}
