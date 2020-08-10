import qs from 'querystring'
import fetch from 'node-fetch'

import {
  shapePrices,
  shapeQuote,
  shapeNews,
  shapeWatchlist,
  shapeProfile,
} from './shape.js'
import { config } from '../util/config.js'
const token = config.IEX_PUB_KEY

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
export async function getPrices(_ws, c) {
  let url
  // intraday
  if (c.series == 'intra') {
    url = buildURL(`stock/${c.symbol}/intraday-prices`, c._time)
  } else {
    // daily
    url = buildURL(`stock/${c.symbol}/chart/${c._time}`)
  }

  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  const data = await response.json()
  return shapePrices(c, data)
}

export async function getQuote(symbol) {
  const url = buildURL(`stock/${symbol}/quote`)
  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeQuote(response)
}

export async function getNews(symbol) {
  const url = buildURL(`stock/${symbol}/news/last/10`)
  let response = await fetch(url)
  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeNews(response)
}

export async function getWatchlist(list) {
  const url = buildURL('stock/market/batch', {
    symbols: list.join(','),
    types: 'quote',
  })
  let response = await fetch(url)

  if (!response.ok) {
    throw response
  }

  response = await response.json()
  return shapeWatchlist(response)
}

export async function getProfile(symbol) {
  let urls = [buildURL(`stock/${symbol}/company`)]

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
