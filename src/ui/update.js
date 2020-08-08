import { getPrices, getQuote, getNews, getWatchlist } from '../api/api.js'
import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'
import { buildNewsList } from './news.js'
import { buildWatchlist } from './watchlist.js'
import { buildRepl } from './repl.js'
import { handleErr } from '../util/error.js'

export async function update(ws, component) {
  // CHARTS
  if (component.type == 'line') {
    // find associated quotelist if any
    const quoteList = ws.options.components.find((c) => c.type == 'quote')
    let pData
    let qData
    try {
      pData = await getPrices(ws, component)
      if (quoteList) qData = await getQuote(component.symbol)
    } catch (e) {
      handleErr(ws, e)
    }

    // build charts
    if (pData) buildPriceVolCharts(ws, component, pData)

    // handle quote
    if (quoteList && qData) buildQuoteList(ws, quoteList, qData)

    // NEWS
  } else if (component.type == 'news') {
    const quoteList = ws.options.components.find((c) => c.type == 'quote')

    let nData
    let qData
    try {
      nData = await getNews(component.symbol)
      qData = await getQuote(component.symbol)
    } catch (e) {
      handleErr(ws, e)
    }

    // build news
    if (nData) buildNewsList(ws, component, nData)

    // handle quote
    if (quoteList && qData) buildQuoteList(ws, quoteList, qData)

    // WATCHLIST
  } else if (component.type == 'watchlist') {
    let data
    try {
      data = await getWatchlist(ws.options.watchlist)
    } catch (e) {
      handleErr(ws, e)
    }

    // build list
    buildWatchlist(ws, component, data)

    // REPL
  } else if (component.type == 'repl') {
    buildRepl(ws, component)
  }
}
