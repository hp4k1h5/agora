// return clean shaped data
export function shapePrices(data, symbol, series) {
  // keep track of last price, which fills in for null price points
  let last = data.find((price) => price.close) || 0
  // intraday vs daily keys
  const x = series == 'intra' ? 'minute' : 'date'
  return data.reduce(
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
    { title: symbol, x: [], y: [], vol: [] },
  )
}
