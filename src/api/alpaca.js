import qs from 'querystring'
import { config } from '../util/config.js'
import { qFetch } from './qFetch.js'
import { getWatchlistIex } from './iex.js'
import { shapeWatchlist } from '../shape/shapeIex.js'

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
    which = ['account', 'positions', 'orders', 'portfolio']

  // order of these calls matters
  const urls = []
  if (which.includes('account')) {
    urls.push(buildAlpacaURL('GET', 'account'))
  }
  if (which.includes('positions')) {
    urls.push(buildAlpacaURL('GET', 'positions'))
  }
  if (which.includes('orders')) {
    urls.push(buildAlpacaURL('GET', 'orders'))
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

  return await Promise.all(
    urls.map(async (url) => {
      return await qFetch(options, url.url, url.httpOptions)
    }),
  )
}

export async function submitOrder(ws, options, order) {
  const { url, httpOptions } = buildAlpacaURL('POST', 'orders', null, order)

  let data = await qFetch(options, url, httpOptions)

  ws.printLines(
    `order ${data.status}: {yellow-fg}${data.side} ${data.filled_qty}/${
      data.qty
    } ${data.symbol} @ ${data.filled_avg_price || 'unfilled'}{/}`,
  )
}

export async function submitCloseAll(ws, options) {
  const { url, httpOptions } = buildAlpacaURL('DELETE', 'positions')

  await qFetch(options, url, httpOptions)

  ws.printLines('all positions closed')
}

export async function submitClose(ws, options, symbol) {
  const { url, httpOptions } = buildAlpacaURL('DELETE', `positions/${symbol}`)

  let data = await qFetch(options, url, httpOptions)
  ws.printLines(
    `order ${data.status}: {yellow-fg}${data.side} ${data.filled_qty}/${
      data.qty
    } ${data.symbol} @ ${data.filled_avg_price || 'unfilled'}{/}`,
  )
}

export async function submitCancelAll(ws, options) {
  const { url, httpOptions } = buildAlpacaURL('DELETE', 'orders')

  await qFetch(options, url, httpOptions)

  ws.printLines('all orders cancelled')
}

export async function submitCancel(ws, options, symbol, orderIds) {
  const orders = await getOrders(options)

  const urls = orders
    .filter((order) =>
      symbol
        ? order.symbol == symbol
        : orderIds.includes(order.id.substring(0, 5)) ||
          orderIds.includes(order.client_order_id.substring(0, 5)),
    )
    .map((order) => buildAlpacaURL('DELETE', `orders/${order.id}`))

  await Promise.all(
    urls.map(async (url) => {
      return await qFetch(options, url.url, url.httpOptions, true)
    }),
  )

  ws.printLines(`${symbol} orders cancelled`)
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

  response = response.map((r) => {
    return shapeWatchlist(r)
  })

  response = response.reduce((a, v, i) => {
    let line = v[0].map(() => '--')
    line[1] = wlNames[i]
    v.unshift(line)
    return [...a, ...v]
  }, [])

  response.shaped = true
  return response
}

export async function getOrders(options) {
  const url = buildAlpacaURL('GET', 'orders')
  return await qFetch(options, url.url, url.httpOptions)
}

export async function getPositions(options) {
  const { url, httpOptions } = buildAlpacaURL('GET', 'positions')
  return await qFetch(options, url, httpOptions)
}

export async function getPosition(options) {
  const { url, httpOptions } = buildAlpacaURL(
    'GET',
    `positions/${options.symbol.toUpperCase()}`,
  )
  return await qFetch(options, url, httpOptions)
}
