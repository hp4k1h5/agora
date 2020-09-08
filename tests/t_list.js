import { getLists } from '../src/api/iex.js'
;(async function () {
  const data = await getLists({
    q: {},
    listTypes: ['gainers', 'losers', 'mostactive', 'iexvolume', 'iexpercent'],
  })
  console.log(JSON.stringify(data, null, 2))
})()
