const repl = {
  type: 'repl',
  yxhw: [6, 9, 6, 3],
}

const line = {
  type: 'line',
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

export const defaults = {
  repl,
  line,
  quote,
  watchlist,
  news,
  profile,
}
