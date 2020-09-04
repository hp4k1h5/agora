import { getWatchlistIex } from '../src/api/iex.js'
;(async () => {
  const data = await getWatchlistIex({ q: {}, watchlist: ['QQQ'] })
  console.log(data)
})()
