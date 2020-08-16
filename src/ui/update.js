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
  charts: { apiFn: getPrices, uiFn: buildPriceVolCharts },
  news: { apiFn: getNews, uiFn: buildNewsList },
  watchlist: { apiFn: getWatchlist, uiFn: buildWatchlist },
  profile: { apiFn: getProfile, uiFn: buildProfile },
  repl: { apiFn: () => {}, uiFn: buildRepl },
}

export async function update(ws, componentOptions, target, _new) {
  let data
  try {
    // make request(s)
    data = await updateMap[componentOptions.type].apiFn(componentOptions)
  } catch (e) {
    return handleErr(e)
  }

  // update ui
  updateMap[componentOptions.type].uiFn(
    ws,
    componentOptions,
    target,
    data,
    _new,
  )

  ws.screen.render()
}
