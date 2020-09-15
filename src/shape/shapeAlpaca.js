import { table } from './shapers.js'

export function shapeAccountAlpaca(data) {
  let [accountData, positionsData, ordersData, ...portfolioData] = data
  const shapedData = {
    account: '',
    positions: '',
    orders: '',
    portfolio: [],
  }

  // shape portfolioData charts
  const periods = [
    { period: '1D' },
    { period: '1W' },
    { period: '1M' },
    { period: '1A' },
  ]
  const r = () => Math.floor(Math.random() * 256)
  portfolioData = portfolioData.map((datum, i) => {
    const period = periods[i].period
    const y = datum.equity.filter((e) => e)
    return [
      {
        title: period,
        x: datum.timestamp,
        y,
        style: { line: [r(), r(), r()] },
      },
    ]
  })

  // shape account info
  let toLocStr = [
    'buying_power',
    'regt_buying_power',
    'daytrading_buying_power',
    'cash',
    'portfolio_value',
    'equity',
    'last_equity',
    'long_market_value',
    'short_market_value',
    'initial_margin',
    'maintenance_margin',
    'last_maintenance_margin',
  ]
  // preshape account
  accountData &&
    Object.keys(accountData).forEach((k) => {
      if (toLocStr.includes(k)) {
        accountData[k] = (+accountData[k]).toLocaleString()
      }
    })

  toLocStr = [
    'qty',
    'avg_entry_price',
    'market_value',
    'cost_basis',
    'unrealized_pl',
    'unrealized_intraday_pl',
    'current_price',
    'lastday_price',
  ]
  const percent = [
    'unrealized_plpc',
    'unrealized_intraday_plpc',
    'change_today',
  ]
  // preshape positions
  if (positionsData) {
    positionsData = shapePositions(positionsData)
  }

  const shapeArrOfObjs = (arr) => {
    if (!arr) return ''
    return arr
      .map((position) => {
        return Object.entries(position)
          .map((d) => {
            d[1] = d[0] == 'symbol' ? `{#cd2-fg}${d[1]}{/}` : d[1]
            d[0] = `{#4be-fg}${d[0].split('_').join(' ')}{/}`
            return table(d, [25])
          })
          .join('\n')
      })
      .join('\n{#eb3-fg}-----------------------{/}\n')
  }

  shapedData.portfolio = portfolioData
  shapedData.account = shapeArrOfObjs([accountData])
  shapedData.orders = shapeOrders(ordersData)
  shapedData.positions = shapeArrOfObjs(positionsData)

  return shapedData
}

export function shapeOrders(ordersData) {
  const m = (order) => `
${order.status} {#cd2-fg}${order.symbol}{/} {#${
    order.side == 'buy' ? 'bfa' : 'fab'
  }-fg}${order.side.toUpperCase()}{/} 
{#6bf-fg}id:${order.id.slice(
    0,
    5,
  )}{/}={#bf6-fg}c_id:${order.client_order_id.slice(0, 5)}{/}
${order.filled_qty}/${order.qty} | {#b5d-fg}${order.type}{/} <${
    order.limit_price || ''
  } >${order.stop_price || ''}
submit {#eb4-fg}${order.time_in_force}{/} @ ${new Date(
    order.submitted_at,
  ).toLocaleString()}`
  // filled @ ${order.filled_at ? new Date(order.filled_at).toLocaleString() : ''}`

  return ordersData
    .sort((l, r) => {
      return l.symbol.localeCompare(r.symbol)
    })
    .map((order) => m(order))
    .join('\n{bold}{#aaa-fg}--------------{/}\n')
}

export function shapePositions(positionsData) {
  const toLocStr = [
    'qty',
    'avg_entry_price',
    'market_value',
    'cost_basis',
    'unrealized_pl',
    'unrealized_intraday_pl',
    'current_price',
    'lastday_price',
  ]
  const percent = [
    'unrealized_plpc',
    'unrealized_intraday_plpc',
    'change_today',
  ]

  // add blank line for narrow component wrapping
  return positionsData
    .sort((l, r) => {
      return l.symbol.localeCompare(r.symbol)
    })
    .map((position) => {
      Object.keys(position).forEach((k) => {
        let val = position[k]
        let color = val >= 0 ? '{#4fb-fg}' : '{#a25-fg}'
        if (toLocStr.includes(k)) {
          position[k] = `${color}${(+val).toLocaleString()}{/}`
        } else if (percent.includes(k)) {
          position[k] = `${color}${(val * 100).toFixed(2)}{/}%`
        }
      })

      return position
    })
}

// this function calculates a range of data related to account activities
export function shapeActivities(activityData) {
  // risk is the total amount of dollars put at risk over a set of FILLs
  let risk = 0
  // pl is the profit or loss on the completed trades over a set of FILLs
  let pl = 0
  // positive completed trades
  let winners = 0

  // a map of symbols invested in over a set of FILLs
  const instruments = {}
  // a list of individual completed trades
  const trades = []

  // loop over each FILL and calculate pl
  activityData.forEach((act) => {
    const sign = act.side == 'buy' ? 1 : -1
    let val = act.price * act.qty

    // instantiate new instrument
    if (!instruments[act.symbol]) {
      risk += val

      instruments[act.symbol] = {
        last: act,
        side: act.side,
        tot_qty: act.qty * sign,
        risk: val,
        pps: val / act.qty,
        pl: 0,
      }
      return
    }

    // existing instrument

    // growing the position
    if (
      (instruments[act.symbol].tot_qty >= 0 && act.side == 'buy') ||
      (instruments[act.symbol].tot_qty <= 0 && act.side != 'buy')
    ) {
      // add to total risk pool
      risk += val
      // calc
      instruments[act.symbol].tot_qty += act.qty * sign
      instruments[act.symbol].risk += val

      // calculate price per share of risk pool
      instruments[act.symbol].pps =
        instruments[act.symbol].risk / Math.abs(instruments[act.symbol].tot_qty)

      return
    }

    // shrinking the position
    // risk -= val

    // calculate profit/loss on the trade
    let _pl
    // calc long exit
    if (instruments[act.symbol].tot_qty >= 0) {
      console.log(instruments[act.symbol].symbol)
      _pl = val - act.qty * instruments[act.symbol].pps
    } else {
      // calc short exit
      _pl = act.qty * instruments[act.symbol].pps - val
    }

    // calc globals
    if (_pl > 0) winners++
    pl += _pl

    // risk off
    instruments[act.symbol].tot_qty += act.qty * sign
    instruments[act.symbol].risk -= val

    instruments[act.symbol].pl += _pl

    trades.push({
      symbol: act.symbol,
      pps_in: instruments[act.symbol].pps,
      pps_out: act.price,
      qty: act.qty,
      pl: _pl,
    })
  })

  return {
    trades,
    instruments,
    pl: pl.toFixed(3),
    tradeCount: activityData.length,
    tradeCompleteCount: trades.length,
    'risk/trade': (risk / trades.length).toFixed(3),
    'pl / risk/trade avg':
      ((pl / (risk / trades.length)) * 100).toFixed(3) + '%',
    '% winning trades': ((winners / trades.length) * 100).toFixed(2) + '%',
  }
}
