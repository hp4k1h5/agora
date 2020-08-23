import { defaults } from './defaults.js'
import { validUnits, validIndicators } from './config.js'
import { submitOrder } from '../api/alpaca.js'
import { clear } from './clear.js'
import { help } from '../ui/help.js'
import { handleErr } from './error.js'

export function setTarget(ws, words, command) {
  // find target component
  let target
  const _new = words.find((w) => w == 'new')
  if (!_new) {
    let tId = words.find((w) => w[0] == '[')
    tId = tId ? +tId.substring(1) : null
    target = ws.options.components.find((c) => c.id == tId)
    if (tId && !target) {
      ws.printLines(`{red-fg}err:{/} no such component id ${tId}`)
      return
    }

    target = target ? target : ws.prevFocus

    // handle close component window
    const x = words.find((w) => w == 'x')
    if (x) {
      ws.options.components.splice(
        ws.options.components.findIndex((c) => c.id == target.id),
        1,
      )
      clear(ws, target)
      ws.options.screen.render()
      return
    }

    if (command && target.type != command) {
      target = { ...defaults[command], ...target }
    }
  } else {
    target = defaults[command]
    target.id = ws.id()
    ws.options.components.push(target)
  }

  return target
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
  } else if (command == 'watchlist') {
    target.watchlist = ws.options.watchlist
  }
}

// only set if component has symbol & user entered symbol
export function setSymbol(options, words) {
  if (!options.symbol) return

  const symbol = words.find((w) => /(?<=\$)[\w.]+/.test(w))
  if (symbol) options.symbol = symbol.slice(1)
}

// only set if component has time & user entered time
export function setTime(ws, options, words) {
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

export async function setOrder(ws, words) {
  // execute orders first cannot be combined with other commands
  const orderCmd = words.find((w) => /^[+-]\d+$/.test(w))
  if (!orderCmd) {
    return false
  }

  let order = { symbol: true }
  setSymbol(order, words)
  order.symbol = order.symbol.toUpperCase()
  order.qty = +orderCmd.substring(1)
  order.side = orderCmd[0] == '+' ? 'buy' : 'sell'

  try {
    await submitOrder(ws, order)
  } catch (e) {
    handleErr(ws, e)
  }
  return true
}
