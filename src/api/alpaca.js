import fetch from 'node-fetch'
import fs from 'fs'

import { config } from '../util/config.js'
import { shapeAccountAlpaca } from './shape.js'

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

export function buildAlpacaURL(path, method, order) {
  const url = `${baseURL}/${path}`
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

export async function getAccountAlpaca() {
  if (!alpacaTokens) {
    return
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

  return shapeAccountAlpaca(data)
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
