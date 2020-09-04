import { getWatchlistAlpaca } from '../src/api/alpaca.js'
;(async () => {
  const data = await getWatchlistAlpaca({ q: {} })
  console.log(data)
})()
