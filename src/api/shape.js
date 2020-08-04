// return clean shaped data
export function shapePrices(c, data) {
  // keep track of last price, which fills in for null price points
  let last = data.find((price) => price.close) || 0
  // intraday vs daily keys
  const x = c.series == 'intra' ? 'minute' : 'date'
  data = data.reduce(
    (a, v) => {
      if (!v.close) {
        v.close = last.close
      }
      // update last
      last = v
      a.x.push(v[x])
      a.y.push(v.close)
      a.vol.push(v.volume)
      return a
    },
    { title: c.symbol, x: [], y: [], vol: [] },
  )
  return {
    price: { title: c.symbol, x: data.x, y: data.y, style: { line: c.color } },
    vol: { x: data.x, y: data.vol, style: { line: c.color } },
  }
}
