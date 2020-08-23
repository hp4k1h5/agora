import fetch from 'node-fetch'

import { config } from '../util/config.js'
import { shapeAccount } from './shape.js'

let alpacaTokens
if (config['APCA_API_KEY_ID'] && config['APCA_API_KEY_ID'].length) {
  alpacaTokens = {
    'APCA-API-KEY-ID': config['APCA_API_KEY_ID'],
    'APCA-API-SECRET-KEY': config['APCA_API_SECRET_KEY'],
  }
}

export function buildAlpacaURL(path, method, order) {
  const baseURLs = {
    paper: 'https://paper-api.alpaca.markets/v2',
    live: 'https://api.alpaca.markets/v2',
  }
  const url = `${baseURLs[config.alpacaAccountType]}/${path}`

  const httpOptions = {
    method,
    headers: alpacaTokens,
  }
  if (order) {
    httpOptions.body = JSON.stringify(order)
    httpOptions.headers['Content-Type'] = 'application/json'
  }

  return { url, httpOptions }
}

export async function getAccount(_options) {
  if (!alpacaTokens) {
    throw 'user must provide APCA_API_KEY_ID and APCA_API_SECRET_KEY as env vars or in the config'
  }

  const { url: accountUrl, httpOptions } = buildAlpacaURL('account', 'GET')
  const { url: positionsUrl } = buildAlpacaURL('positions', 'GET')
  const urls = [accountUrl, positionsUrl]

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

  return shapeAccount(data)
}

export async function submitOrder(ws, order) {
  order.time_in_force = 'day'
  order.type = 'market'
  const { url, httpOptions } = buildAlpacaURL('orders', 'POST', order)

  let response = await fetch(url, httpOptions)
  if (!response.ok) {
    throw response
  }

  response = await response.json()

  ws.printLines(JSON.stringify(response, null, 2))
  return
}
