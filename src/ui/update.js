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
  getActivities,
} from '../api/alpaca.js'

import { buildBlank } from './blank.js'
import { buildRepl } from './repl.js'
import { buildPriceVolCharts } from './graph.js'
import { buildAccount } from './account.js'
import { buildWatchlist } from './watchlist.js'
import { buildBots } from './bots.js'
import { buildQuoteList } from './iex/quote.js'
import { buildNewsList } from './iex/news.js'
import { buildLists } from './iex/list.js'
import { buildProfile } from './iex/profile.js'
import { buildSectors } from './iex/sectors.js'
import { buildBook } from './iex/book.js'
import { buildOrders } from './alpaca/orders.js'
import { buildPositions } from './alpaca/positions.js'
import { buildActivities } from './alpaca/activities.js'

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
  activities: { apiFn: getActivities, uiFn: buildActivities },
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
    clearInterval(options.interval)
    await up()
    options.interval = setInterval(up, options.pollMs)
  } else {
    clearInterval(options.interval)
    up()
  }

  async function up() {
    let scroll
    try {
      if (options.pollMs && options.box.getScrollPerc) {
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
