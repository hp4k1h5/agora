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
  const m = (order) =>
    `{#cd2-fg}${order.symbol}{/} {#${
      order.side == 'buy' ? 'bfa' : 'fab'
    }-fg}${order.side.toUpperCase()}{/}
{#6bf-fg}id:${order.id.slice(
      0,
      4,
    )}{/}::{#bf6-fg}c_id:${order.client_order_id.slice(0, 5)}{/}
${order.filled_qty}/${order.qty}     |  ${order.type}
submit @ ${new Date(order.submitted_at).toLocaleString()}
${
  order.filled_at
    ? `filled @ ${new Date(order.filled_at)?.toLocaleString()}`
    : ''
}`
  return ordersData
    .sort((l, r) => {
      return l.symbol.localeCompare(r.symbol)
    })
    .map((order) => m(order))
    .join('\n{bold}{#aaa-fg}--------------{/}\n')
}

export function shapePositions(positionsData) {
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
  return positionsData.map((position) => {
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
