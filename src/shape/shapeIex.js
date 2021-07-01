import { table, abbrevNum } from './shapers.js'

// return clean shaped data
export function shapePrices(options, data) {
  let priceData, indicatorData

  if (data && options.indicator) {
    priceData = data.chart
    indicatorData = data.indicator
  } else if (data) {
    priceData = data
  }
  // some indicators returns a blank {} off trading hours
  if (!Object.keys(data).length) {
    priceData = []
  }

  // keep track of last price, which fills in for null price points
  let last = priceData.find((price) => price.close) || 0

  // intraday vs daily keys
  const xKey = options.series == 'intra' ? 'minute' : 'date'

  priceData = priceData.reduce(
    (a, v) => {
      if (!v.close) {
        v.close = last.close
      }
      // update last
      last = v
      a.x.push(v[xKey])
      a.y.push(v.close)
      a.vol.push(v.volume)
      return a
    },
    { x: [], y: [], vol: [] },
  )

  const shapedData = {
    price: {
      title: `${options.time} $${options.symbol}`,
      x: priceData.x,
      y: priceData.y,
      style: { line: options.color },
    },
    vol: [
      {
        title: 'vol',
        x: priceData.x,
        y: priceData.vol,
        style: { line: [200, 250, 30] },
      },
    ],
  }

  if (indicatorData) {
    shapedData.indicators = indicatorData.map((indicator) => {
      return {
        title: options.indicator.name,
        x: priceData.x,
        y: indicator,
        style: { line: [250, 230, 150] },
      }
    })
  }

  return shapedData
}

export function shapeQuote(data) {
  data = Object.entries(data || {})
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
    close: (d) => ['close', `{#dc5-fg}${d[1]}{/}`],
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
    marketCap: (d) => [d[0], d[1].toLocaleString()],
  }
  return data
    .filter((d) => m[d[0]])
    .map((d) => [d[0], d[1] || ''])
    .map((d) => table(m[d[0]](d), [10]))
    .join('\n')
}

export function shapeNews(data) {
  const m = {
    datetime: (d) => {
      const date = new Date(d[1])
      return [d[0], `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`]
    },
    headline: (d) => [d[0], `{#ee7-fg}${d[1]}{/}`],
    source: (d) => [d[0], `{#fff-fg}${d[1]}{/}`],
    summary: (d) => [d[0], `{#bfc-fg}${d[1]}{/}`],
  }

  let items = [`{#bf6-fg}\$${data[0].related}{/}`]
  data.forEach((i) => {
    items.push(
      ...Object.entries(i)
        .filter((d) => m[d[0]])
        .map((d) => table(m[d[0]](d), [10])),
    )
    items[items.length - 2] += ' {#abf-fg}< ' + i.url + ' >{/}'
    items.push(
      '{#db7-fg}========={/}    {#db7-fg}=============================={/}',
    )
  })
  return items.join('\n')
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
    previousClose: (d) => ['prev', '' + d[1].toFixed(2)],
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
  if (!data) throw 'no data for symbol'

  let [company, keyStats, earnings, financials] = data

  company = `{#afa-fg}${company.symbol}{/}  ${company.companyName}

{#4be-fg}exchange{/}: ${company.exchange}
{#4be-fg}industry{/}: ${company.industry}
{#4be-fg}sector{/}: ${company.sector}
{#4be-fg}primary sic code{/}: ${company.primarySicCode}  
{#4be-fg}issue type{/}: ${company.issueType}
{#4be-fg}description{/}: {#eb4-fg}${company.description}{/}`

  function shape(obj) {
    const treat = (v) => {
      if (!v) return ''
      if (typeof v == 'number') {
        const color = v >= 0 ? '{#4ea-fg}' : '{#eaa-fg}'
        return color + v.toLocaleString() + '{/}'
      }
      return v
    }

    return Object.entries(obj)
      .map((e) => {
        return `{#4be-fg}${e[0]}{/}: ${treat(e[1])}`
      })
      .join('\n')
  }

  keyStats = shape(keyStats)
  if (earnings.earnings) earnings = shape(earnings.earnings[0])
  else earnings = '{#eb5-fg}no data{/}'
  if (financials.financials) financials = shape(financials.financials[0])
  else financials = '{#eb5-fg}no data{/}'
  return { company, keyStats, earnings, financials }
}

export function shapeLists(data, types) {
  const m = {
    mostactive: (d) => table([d.symbol, d.volume?.toLocaleString()], [5]),
    changePercent: (d) =>
      table(
        [
          d.symbol,
          `{#${
            d.changePercent >= 0 ? '4fb' : 'a25'
          }-fg}${d.changePercent?.toFixed(1)}{/}%`,
        ],
        [5],
      ),
    iexvolume: (d) => table([d.symbol, d.iexVolume?.toLocaleString()], [5]),
  }

  let shaped = {}
  types.forEach((type, i) => {
    let _type = type
    if (['gainers', 'losers', 'iexpercent'].includes(type)) {
      _type = 'changePercent'
    }
    shaped[type] = data[i]
      .sort((l, r) => {
        return r[_type] - l[_type]
      })
      .map((d) => {
        d.symbol = `{#4be-fg}${d.symbol}{/}`
        return m[_type](d)
      })
      .join('\n')
  })
  return shaped
}

export function shapeSectors(data) {
  return data
    .map((datum) => {
      return table(
        [
          `{#4be-fg}${datum.name}{/}`,
          `{#${datum.performance >= 0 ? '4fb' : 'a25'}-fg}${(
            datum.performance * 100
          ).toFixed(1)}{/}%`,
        ],
        [23],
      )
    })
    .join('\n')
}

// descending from red to yellow
const bookColors = [
  '{#8fc-bg}',
  '{#be7-bg}',
  '{#db9-bg}',
  '{#abd-bg}',
  '{#9bf-bg}',
]
export function shapeBook(data) {
  let { bids, asks, trades } = data
  bids = shapeBidAsk(bids)
  asks = shapeBidAsk(asks)
  trades = shapeBidAsk(trades, true)

  function shapeBidAsk(bidsOrAsks, timestamp) {
    if (!bidsOrAsks) return ''

    return bidsOrAsks
      .slice(0, 5)
      .map((ba, i) => {
        timestamp = timestamp
          ? new Date(ba.timestamp).toLocaleTimeString()
          : null
        return table(
          [`${bookColors[i]}${ba.size}`, `{#000-fg}${ba.price}{/}`, timestamp],
          [5, 7],
          ' @ ',
        )
      })
      .join('\n')
  }

  return { bids, asks, trades }
}

export function shapeAccountIex(data) {
  const stats = {
    mu: data.messages.monthlyUsage,
    payg: data.messages.monthlyPayAsYouGo,
  }

  const dailyUsage = [Object.values(data.messages.dailyUsage).map((m) => +m)]

  const total = stats.mu + stats.payg

  const r = () => Math.floor(Math.random() * 255)
  let keyUsage = Object.entries(data.messages.keyUsage)
    .map((m) => {
      const stroke = [r(), r(), r()]
      return {
        percent: Math.ceil((+m[1] / total) * 100),
        stroke,
        key: `{#${stroke
          .map((s) => Math.floor(s / 16).toString(16))
          .join('')}-fg}${m[0].toLowerCase().split('_').join(' ')}{/}`,
      }
    })
    .filter((m) => m.percent > 1)

  return { stats, dailyUsage, keyUsage }
}
