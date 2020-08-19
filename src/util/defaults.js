const repl = {
  type: 'repl',
  yxhw: [6, 9, 6, 3],
}

const chart = {
  type: 'chart',
  chartType: 'line',
  symbol: 'goog',
  time: '100min',
  vol: true,
  yxhw: [0, 0, 9, 9],
  color: 'green',
}

const quote = {
  type: 'quote',
  yxhw: [0, 9, 6, 3],
}

const watchlist = {
  type: 'watchlist',
  yxhw: [0, 0, 12, 9],
  symbol: 'ge',
}

const news = {
  type: 'news',
  symbol: 'aapl',
  yxhw: [0, 0, 12, 9],
}

const profile = {
  type: 'profile',
  yxhw: [0, 0, 12, 9],
  symbol: 'de',
}

const list = {
  type: 'list',
  yxhw: [0, 0, 6, 9],
  listTypes: ['mostactive', 'gainers', 'losers', 'iexvolume', 'iexpercent'],
}

export const defaults = {
  repl,
  chart,
  quote,
  watchlist,
  news,
  profile,
  list,
}
