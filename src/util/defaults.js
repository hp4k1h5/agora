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
  symbol: 'qqq',
}

const watchlist = {
  type: 'watchlist',
  yxhw: [0, 0, 12, 9],
  watchlist: ['ge'],
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

const sectors = {
  type: 'sectors',
  yxhw: [0, 9, 4, 3],
}

const book = {
  type: 'book',
  symbol: 'qqq',
  yxhw: [0, 0, 4, 4],
  pollMs: 1000,
}

const account = {
  type: 'account',
  yxhw: [0, 0, 12, 9],
}

const help = {
  type: 'help',
  yxhw: [1, 1, 9, 9],
}

export const defaults = {
  repl,
  chart,
  quote,
  watchlist,
  news,
  profile,
  list,
  sectors,
  book,
  account,
  help,
}
