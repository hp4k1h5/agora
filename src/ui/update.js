import {
  getPrices,
  getQuote,
  getNews,
  getWatchlistIex,
  getLists,
  getProfile,
  getSectors,
  getBook,
  getAccountIex,
} from '../api/iex.js'
import {
  getAccountAlpaca,
  getWatchlistAlpaca,
  getOrders,
  getPositions,
} from '../api/alpaca.js'

import { buildBlank } from './blank.js'
import { buildRepl } from './repl.js'
import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'
import { buildNewsList } from './news.js'
import { buildWatchlist } from './watchlist.js'
import { buildLists } from './list.js'
import { buildProfile } from './profile.js'
import { buildSectors } from './sectors.js'
import { buildBook } from './book.js'
import { buildOrders } from './orders.js'
import { buildPositions } from './positions.js'
import { buildAccount } from './account.js'
import { buildBots } from './bots.js'

import { handleErr } from '../util/error.js'

const updateMap = {
  blank: { apiFn: () => {}, uiFn: buildBlank },
  repl: { apiFn: () => {}, uiFn: buildRepl },
  quote: { apiFn: getQuote, uiFn: buildQuoteList },
  chart: { apiFn: getPrices, uiFn: buildPriceVolCharts },
  news: { apiFn: getNews, uiFn: buildNewsList },
  watchlist: { apiFn: getWatchlistIex, uiFn: buildWatchlist },
  watchlistAlpaca: { apiFn: getWatchlistAlpaca, uiFn: buildWatchlist },
  profile: { apiFn: getProfile, uiFn: buildProfile },
  list: { apiFn: getLists, uiFn: buildLists },
  sectors: { apiFn: getSectors, uiFn: buildSectors },
  book: { apiFn: getBook, uiFn: buildBook },
  orders: { apiFn: getOrders, uiFn: buildOrders },
  positions: { apiFn: getPositions, uiFn: buildPositions },
  account: {
    apiFn: async (options) => {
      return await Promise.all([
        getAccountIex(options),
        getAccountAlpaca(options),
      ])
    },
    uiFn: buildAccount,
  },
  bots: { apiFn: () => {}, uiFn: buildBots },
}

export async function update(ws, options) {
  let data

  if (options.pollMs) {
    await up()
    options.interval = setInterval(up, options.pollMs)
  } else {
    clearInterval(options.interval)
    up()
  }

  async function up() {
    let scroll
    try {
      if (options.pollMs) {
        scroll = options.box.getScrollPerc()
      }
      // make request(s)
      data = await updateMap[options.type].apiFn(options)
    } catch (e) {
      if (e.q) {
        // if the response is older than what is in the q, discard it, and don't update
        handleErr(ws, e.q)
        return
      }
      handleErr(ws, e)
    }

    // update ui
    updateMap[options.type].uiFn(ws, options, data)
    if (scroll) options.box.setScroll(scroll)

    ws.options.screen.render()
  }
}
