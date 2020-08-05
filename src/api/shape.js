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

export function shapeQuote(data) {
  data = Object.entries(data)
  const m = {
    symbol: (d) => d,
    companyName: (d) => [d[0], `{#4be-fg}${d[1]}{/}`],
    latestPrice: (d) => [d[0], `{#cc5-fg}${d[1]}{/}`],
    volume: (d) => [d[0], `{#cc5-fg}${d[1].toLocaleString()}{/}`],
    change: (d) => [d[0], `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${d[1]}{/}`],
    changePercent: (d) => [
      d[0],
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(3)}%{/}`,
    ],
    open: (d) => d,
    close: (d) => d,
    high: (d) => [d[0], `{#2fe-fg}${d[1]}{/}`],
    low: (d) => [d[0], `{#a25-fg}${d[1]}{/}`],
    previousClose: (d) => [d[0], '' + d[1]],
    week52High: (d) => [d[0], `{#2fe-fg}${d[1]}{/}`],
    week52Low: (d) => [d[0], `{#a25-fg}${d[1]}{/}`],
    ytdChange: (d) => [
      d[0],
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(3)}%{/}`,
    ],
    peRatio: (d) => d,
    marketCap: (d) => [d[0], (+d[1]).toLocaleString()],
  }
  return (
    data
      .filter((d) => m[d[0]])
      .map((d) => m[d[0]](d))
      // remove nulls before blessed-contrib table calls toString()
      .map((d) => [d[0], d[1] || ''])
  )
}

export function shapeNews(data) {
  const m = {
    datetime: (d) => [d[0], new Date(d[1])],
    headline: (d) => [d[0], `{#ee7-fg}${d[1]}{/}`],
    source: (d) => [d[0], d[1]],
    summary: (d) => [d[0], d[1]],
  }
  let items = []
  data.forEach((i) => {
    items.push(
      ...Object.entries(i)
        .filter((d) => m[d[0]])
        .map((d) => m[d[0]](d)),
    )
    items[items.length - 2][1] += ' {#abf-fg}< ' + i.url + ' >{/}'
    items.push(['{#ccc-fg}------------{/}', '   {#ccc-fg}----------------{/}'])
  })
  return items
}
