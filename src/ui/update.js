import {
  getPrices,
  getQuote,
  getNews,
  getWatchlist,
  getProfile,
  getLists,
} from '../api/iex.js'
import { getAccount } from '../api/alpaca.js'

import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'
import { buildNewsList } from './news.js'
import { buildWatchlist } from './watchlist.js'
import { buildProfile } from './profile.js'
import { buildLists } from './list.js'
import { buildRepl } from './repl.js'
import { buildAccount } from './account.js'

import { handleErr } from '../util/error.js'

const updateMap = {
  quote: { apiFn: getQuote, uiFn: buildQuoteList },
  chart: { apiFn: getPrices, uiFn: buildPriceVolCharts },
  news: { apiFn: getNews, uiFn: buildNewsList },
  watchlist: { apiFn: getWatchlist, uiFn: buildWatchlist },
  profile: { apiFn: getProfile, uiFn: buildProfile },
  list: { apiFn: getLists, uiFn: buildLists },
  account: { apiFn: getAccount, uiFn: buildAccount },
  repl: { apiFn: () => {}, uiFn: buildRepl },
}

export async function update(ws, options) {
  let data
  try {
    // make request(s)
    data = await updateMap[options.type].apiFn(options)
  } catch (e) {
    return handleErr(ws, e)
  }

  // update ui
  updateMap[options.type].uiFn(ws, options, data)

  ws.options.screen.render()
}
