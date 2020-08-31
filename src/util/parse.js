import { carousel } from '../index.js'
import { defaults } from './defaults.js'
import { validUnits, validIndicators } from './config.js'
import { submitOrder } from '../api/alpaca.js'
import { clear } from './clear.js'
import { help } from '../ui/help.js'
import { handleErr } from './error.js'

export function setTargets(ws, words, command) {
  // find target component
  let target
  const _new = words.find((w) => w == '[new')
  const _all = words.find((w) => w == '[all')
  if (!_new && !_all) {
    let tId = words.find((w) => w[0] == '[')
    tId = tId ? +tId.substring(1) : null
    target = ws.options.components.find((c) => c.id == tId)
    if (tId && !target) {
      ws.printLines(`{red-fg}err:{/} no such component id ${tId}`)
      return []
    }

    target = target ? target : ws.prevFocus
    if (target.interval) {
      clearInterval(target.interval)
    }

    // handle close component window
    const x = words.find((w) => w == 'x')
    if (x) {
      clear(ws, target)
      ws.options.components.splice(
        ws.options.components.findIndex((c) => c.id == target.id),
        1,
      )
      ws.options.screen.render()
      return []
    }

    if (command && target.type != command) {
      target = { ...defaults[command], ...target }
      ws.options.components.splice(
        ws.options.components.findIndex((c) => c.id == target.id),
        1,
        target,
      )
    }
  } else if (_new) {
    target = defaults[command]
    initComponent(ws, target)
    setSymbol(target, words)
    ws.options.components.push(target)
  } else {
    // [all targets all targetable components
    target = ws.options.components.filter(
      (c) => c.id && !['bots'].includes(c.type),
    )
  }

  return Array.isArray(target) ? target : [target]
}

export function setComponentOptions(ws, target, words, command) {
  target.type = command || target.type

  if (target.type == 'chart') {
    // set technical indicator
    const indicator = words.find((w) => w[0] == '%')
    if (indicator) {
      target.indicator = indicator.substring(1)
      if (!target.indicator.length) {
        delete target.indicator
      } else {
        const indicatorOptions = validIndicators.find(
          (i) => i.name == target.indicator,
        )
        if (!indicatorOptions) {
          // TODO fuzzy search indicators
          handleErr(ws, `no such indicator ${target.indicator}`)
          delete target.indicator
        } else {
          target.indicator = indicatorOptions
        }
      }
    }
  } else if (target.type == 'watchlist') {
    target.watchlist = target.watchlist || ws.options.watchlist || ['goog']
    if (target.watchlist == 'alpaca') {
      target.type = 'watchlistAlpaca'
    }
  }
}

// only set if component has symbol & user entered symbol
export function setSymbol(options, words) {
  if (!options.symbol) return
  if (options.symbol === true) options.symbol = ''
  const symbol = words.find((w) => /(?<=^\$)[\w.]+/.test(w))
  if (symbol) options.symbol = symbol.slice(1)
}

// only set if component has time & user entered time
export function setTime(ws, options, words) {
  let poll = words.find((w) => /poll[\d.]*/.test(w))
  if (poll && !['bots'].includes(options.type)) {
    poll = +poll.match(/[\d|e]+$/)
    if (!poll) {
      clearInterval(options.interval)
      delete options.interval
      delete options.pollMs
    } else if (poll > 0 && poll < 10) {
      throw 'cannot set polling interval below 10 milliseconds'
    } else {
      options.pollMs = poll
    }
  }

  if (!options.time) return

  // find time
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  if (!time && options._time) return

  if (!options._time) {
    time = options.time
  } else {
    time = time.slice(1)
  }

  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    options.series = 'intra'
    options.time = intra[0]
    options._time = {
      chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1),
    }
  } else if (time == '1d') {
    options.series = 'intra'
    options.time = time
    options._time = { chartLast: 1000 }
  } else {
    // handle historical
    if (!validUnits.includes(time)) {
      ws.printLines(`{red-fg}err:{/} invalid time`)
      help(ws, ['h', ':'])
      return
    }
    options.series = 'hist'
    options.time = time
    options._time = time
  }
}

export async function setOrder(ws, options, words) {
  // execute orders first cannot be combined with other commands
  const orderCmd = words.find((w) => /^[+-]\d+$/.test(w))
  const closeCmd = words.find((w) => w == 'close')
  if (!orderCmd && !closeCmd) {
    return false
  }

  let order = { symbol: true }

  setSymbol(order, words)
  order.symbol = order.symbol.toUpperCase()

  if (closeCmd) {
    if (words.find((w) => w == 'all')) {
      // closeAllPositions(order)
      // ws.printLines(`closing all positions...`)
    }
    return
  }

  order.qty = +orderCmd.substring(1)
  order.side = orderCmd[0] == '+' ? 'buy' : 'sell'
  order.type =
    words.find((w) => ['market', 'limit', 'stop', 'stop_limit'].includes(w)) ||
    'market'
  order.limit_price = words.find((w) => /^[<>][\d.]+$/.test(w))
  if (order.type == 'limit' && !order.limit_price) {
    handleErr(
      ws,
      'limit order must include limit_price, e.g. {yellow-fg}<3.16{/}',
    )
    return true
  } else if (order.limit_price) {
    order.type = 'limit'
    order.limit_price = +order.limit_price?.slice(1)
  }
  ws
  order.time_in_force =
    words.find((w) => ['day', 'gtc', 'opg', 'cls', 'ioc', 'fok'].includes(w)) ||
    'day'

  try {
    await submitOrder(ws, options, order)
  } catch (e) {
    handleErr(ws, e)
  }
  return true
}

export function initComponent(ws, options) {
  options.id = ws.id()
  options.wsId = ws.options.id
  options.q = {}

  ws.options.screen.on('move', () => {
    // cancel all requests from last ws in flight
    Object.keys(options.q).forEach((url) => {
      if (carousel.currPage != options.wsId) {
        options.q[url] = Infinity
      } else {
        delete options.q[url]
      }
    })
  })

  setComponentOptions(ws, options, [], null)
  setTime(ws, options, [`:${options.time}`])
}
