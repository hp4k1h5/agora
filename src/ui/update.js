import { getPrices, getQuote, getNews, getWatchlist } from '../api/api.js'
import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'
import { buildNewsList } from './news.js'
import { buildWatchlist } from './watchlist.js'
import { buildRepl } from './repl.js'

export async function update(ws, component) {
  if (component.type == 'line') {
    // CHARTS

    let data
    try {
      data = await getPrices(ws, component)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${e.status > 400 ? '$' + component.symbol : ''} ${
          e.statusText
        }{/}`,
      )
      return
    }
    buildPriceVolCharts(ws, component, data)

    // handle quote
    const quoteList = ws.options.components.find((c) => c.type == 'quote')
    if (!quoteList) return

    try {
      data = await getQuote(component.symbol)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${e.status > 400 ? '$' + component.symbol : ''} ${
          e.statusText || e
        }{/}`,
      )
      return
    }
    buildQuoteList(ws, quoteList, data)
  } else if (component.type == 'news') {
    // NEWS

    let data
    try {
      data = await getNews(component.symbol)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${
          e.status > 400 ? '$' + component.symbol : ''
        } ${e}{/}`,
      )
      return
    }
    buildNewsList(ws, component, data)

    // handle quote
    const quoteList = ws.options.components.find((c) => c.type == 'quote')
    if (!quoteList) return

    try {
      data = await getQuote(component.symbol)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${
          e.status > 400 ? '$' + component.symbol : ''
        } ${e}{/}`,
      )
      return
    }
    buildQuoteList(ws, quoteList, data)
  } else if (component.type == 'watchlist') {
    // WATCHLIST

    let data
    try {
      data = await getWatchlist(ws.options.watchlist)
    } catch (e) {
      ws.printLines(`{red-fg}error:{/} ${e}`)
      return
    }

    buildWatchlist(ws, component, data)
  } else if (component.type == 'repl') {
    // REPL

    buildRepl(ws, component)
  }
}
