import {
  getPrices,
  getQuote,
  getNews,
  getWatchlist,
  getProfile,
} from '../api/api.js'

import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'
import { buildNewsList } from './news.js'
import { buildWatchlist } from './watchlist.js'
import { buildProfile } from './profile.js'
import { buildRepl } from './repl.js'
import { handleErr } from '../util/error.js'

const updateMap = {
  quote: { apiFn: getQuote, uiFn: buildQuoteList },
}

// export async function update(ws, componentOptions) {}

export async function update(ws, componentOptions) {
  // QUOTE
  if (componentOptions.type == 'quote') {
    let qData
    try {
      qData = await getQuote(ws, componentOptions)
    } catch (e) {
      return handleErr(e)
    }
    buildQuoteList(ws, componentOptions, qData)
  }

  // CHARTS
  else if (componentOptions.type == 'line') {
    let pData
    try {
      pData = await getPrices(ws, componentOptions)
    } catch (e) {
      return handleErr(ws, e)
    }
    buildPriceVolCharts(ws, componentOptions, pData)
  }

  // NEWS
  else if (componentOptions.type == 'news') {
    let nData
    try {
      nData = await getNews(componentOptions.symbol)
    } catch (e) {
      return handleErr(ws, e)
    }
    buildNewsList(ws, componentOptions, nData)
  }

  // WATCHLIST
  else if (componentOptions.type == 'watchlist') {
    let data
    try {
      data = await getWatchlist(ws.options.watchlist)
    } catch (e) {
      return handleErr(ws, e)
    }
    // build list
    buildWatchlist(ws, componentOptions, data)
  }

  // PROFILE
  else if (componentOptions.type == 'profile') {
    let pData
    try {
      pData = await getProfile(componentOptions.symbol)
    } catch (e) {
      return handleErr(ws, e)
    }
    buildProfile(ws, componentOptions, pData)
  }

  // REPL
  else if (componentOptions.type == 'repl') {
    buildRepl(ws, componentOptions)
  }

  // render() is not called in any of the dependent functions
  ws.screen.render()
}
