// return clean shaped data
export function shapePrices(options, data) {
  // keep track of last price, which fills in for null price points
  let last = data.find((price) => price.close) || 0
  // intraday vs daily keys
  const x = options.series == 'intra' ? 'minute' : 'date'
  // hilo
  let hi = -Infinity
  let lo = Infinity
  data = data.reduce(
    (a, v) => {
      if (!v.close) {
        v.close = last.close
      }
      // update last
      last = v
      a.x.push(v[x])
      a.y.push(v.close)
      if (v.close > hi) hi = v.close
      if (v.close < lo) lo = v.close
      a.vol.push(v.volume)
      return a
    },
    { x: [], y: [], vol: [] },
  )
  return {
    price: {
      title: `${options.symbol} ${hi.toFixed(1)}:${lo.toFixed(1)}`,
      x: data.x,
      y: data.y,
      style: { line: options.color },
    },
    vol: { x: data.x, y: data.vol, style: { line: options.color } },
  }
}

export function shapeQuote(data) {
  data = Object.entries(data)
  const m = {
    symbol: (d) => d,
    companyName: (d) => ['name', d[1].substring(0, 20)],
    latestPrice: (d) => ['latest', `{#cc5-fg}${d[1]}{/}`],
    volume: (d) => [d[0], `{#cc5-fg}${d[1].toLocaleString()}{/}`],
    avgTotalVolume: (d) => ['avgVol', `{#bbb-fg}${d[1].toLocaleString()}{/}`],
    change: (d) => [d[0], `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${d[1]}{/}`],
    changePercent: (d) => [
      '%',
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(2)}%{/}`,
    ],
    open: (d) => d,
    close: (d) => d,
    high: (d) => [d[0], `{#2fe-fg}${d[1]}{/}`],
    low: (d) => [d[0], `{#a25-fg}${d[1]}{/}`],
    previousClose: (d) => ['prev', '' + d[1]],
    week52High: (d) => ['52hi', `{#2fe-fg}${d[1]}{/}`],
    week52Low: (d) => ['52lo', `{#a25-fg}${d[1]}{/}`],
    ytdChange: (d) => [
      'ytd',
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(2)}%{/}`,
    ],
    peRatio: (d) => d,
    marketCap: (d) => [d[0], (+d[1]).toLocaleString()],
  }
  return (
    data
      .filter((d) => m[d[0]])
      // replace nulls before blessed-contrib table calls toString()
      .map((d) => [d[0], d[1] || ''])
      .map((d) => m[d[0]](d))
  )
}

export function shapeNews(data) {
  const m = {
    datetime: (d) => [d[0], new Date(d[1])],
    headline: (d) => [d[0], `{#ee7-fg}${d[1]}{/}`],
    source: (d) => [d[0], `{#fff-fg}${d[1]}{/}`],
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

export function shapeWatchlist(data) {
  const m = {
    symbol: (d) => d,
    latestPrice: (d) => ['latest', `{#cc5-fg}${d[1]}{/}`],
    volume: (d) => [d[0], abbrevNum(d[1])],
    change: (d) => [d[0], `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${d[1]}{/}`],
    changePercent: (d) => [
      '%',
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(2)}{/}`,
    ],
    open: (d) => [d[0], '' + d[1]],
    close: (d) => [d[0], '' + d[1]],
    high: (d) => [d[0], `{#2fe-fg}${d[1]}{/}`],
    low: (d) => [d[0], '' + d[1]],
    previousClose: (d) => ['prev', '' + d[1]],
    week52High: (d) => ['52hi', '' + `{#2fe-fg}${d[1]}{/}`],
    week52Low: (d) => ['52lo', '' + d[1]],
    ytdChange: (d) => [
      'ytd',
      `{#${d[1] >= 0 ? '4fb' : 'a25'}-fg}${(d[1] * 100).toFixed(2)}%{/}`,
    ],
    peRatio: (d) => ['p/e', '' + d[1]],
    marketCap: (d) => ['mktCap', abbrevNum(d[1])],
  }
  let shapedList = []
  Object.keys(data).forEach((d) => {
    let quote = data[d].quote
    quote = Object.entries(quote)
      .filter((q) => m[q[0]])
      .map((q) => [q[0], q[1] || ''])
      .map((q) => m[q[0]](q))
    shapedList.push(quote)
  })
  const keys = shapedList[0].map((s) => s[0])
  shapedList = shapedList.map((s) => s.map((q) => q[1]))
  shapedList.unshift(keys)

  return shapedList
}

/** data is an array of json responses from a series of profile related calls */
export function shapeProfile(data) {
  if (!data || !data.length) return 'no data for symbol'

  // first datum is from `/company`
  let company = data[0]
  // second is `/stats`
  let keyStats = data[1]
  // third is `/earnings`
  let earnings = data[2]

  company = `{#afa-fg}${company.symbol}{/}  ${company.companyName}

{#4be-fg}exchange{/}: ${company.exchange}
{#4be-fg}industry{/}: ${company.industry}
{#4be-fg}sector{/}: ${company.sector}
{#4be-fg}primary sic code{/}: ${company.primarySicCode}  
{#4be-fg}issue type{/}: ${company.issueType}
{#4be-fg}description{/}: {#eb4-fg}${company.description}{/}`

  const treat = (v) => {
    if (!v) return ''
    if (typeof v == 'number') {
      const color = v >= 0 ? '{#4ea-fg}' : '{#eaa-fg}'
      return color + v.toLocaleString() + '{/}'
    }
    return v
  }

  if (keyStats)
    keyStats = Object.entries(keyStats)
      .map((e) => {
        return `{#4be-fg}${e[0]}{/}: ${treat(e[1])}`
      })
      .join('\n')
  else keyStats = ''

  if (earnings && earnings.earnings)
    earnings = Object.entries(earnings.earnings[0])
      .map((e) => {
        return `{#4be-fg}${e[0]}{/}: ${treat(e[1])}`
      })
      .join('\n')
  else earnings = ''

  return { company, keyStats, earnings }
}

function abbrevNum(num) {
  if (!num) return ''
  const l = ' KMBT'
  let c = 0
  while (num > 1e3) {
    num = num / 1000
    c++
  }
  return num.toFixed(1) + l[c] || ''
}
