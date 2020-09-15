const blank = {
  type: 'blank',
  yxhw: [3, 3, 6, 6],
}

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
}

const account = {
  type: 'account',
  yxhw: [0, 0, 12, 9],
}

const orders = {
  type: 'orders',
  yxhw: [0, 0, 6, 3],
}

const positions = {
  type: 'positions',
  yxhw: [0, 3, 6, 3],
}

const activities = {
  type: 'activities',
  yxhw: [0, 2, 6, 6],
  activityTypes: ['FILL'],
}

const bots = {
  type: 'bots',
  yxhw: [0, 6, 6, 6],
}

const help = {
  type: 'help',
  yxhw: [1, 1, 9, 9],
}

export const defaults = {
  blank,
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
  orders,
  positions,
  activities,
  bots,
  help,
}
