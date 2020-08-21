import { defaults } from '../util/defaults.js'
import { validUnits } from '../util/config.js'
import { update } from './update.js'
import { search as fuzzySearch } from './search.js'
import { submitOrder } from '../api/alpaca.js'
import { help } from './help.js'
import { handleErr } from '../util/error.js'

export async function evaluate(ws, input) {
  // define command to execute
  const commands = {
    exit,
    quit: exit,
    help,
    h: help,
    '?': search,
    undefined,
    '#': 'chart',
    '!': 'news',
    '=': 'watchlist',
    '&': 'profile',
    '"': 'quote',
    '*': 'list',
    '@': 'account',
  }

  // parse input
  const words = input.split(/\s+/g)

  // execute orders first cannot be combined with other commands
  const orderCmd = words.find((w) => /^[+-]\d+$/.test(w))
  if (orderCmd) {
    let order = { symbol: true }
    setSymbol(order, words)
    order.symbol = order.symbol.toUpperCase()
    order.qty = +orderCmd.substring(1)
    order.side = orderCmd[0] == '+' ? 'buy' : 'sell'

    try {
      return await submitOrder(ws, order)
    } catch (e) {
      return handleErr(ws, e)
    }
  }

  // find any commands
  const command = commands[words.find((w) => commands[w])]
  // execute repl fns next
  if (typeof command == 'function') return await command(ws, words)

  // execute component commands
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
    if (target.type != command) {
      target = { ...defaults[command], ...target }
    }
  } else {
    target = defaults[command]
    target.id = ws.id()
  }

  // set component type and options
  target.type = command || target.type
  if (command == 'chart') {
    target.chartType =
      words.find((w) => ['line', 'bar', 'ohlc'].includes(w)) || target.chartType
  } else if (command == 'watchlist') {
    target.watchlist = ws.options.watchlist
  }
  setSymbol(target, words)
  setTime(target, words, ws)

  await update(ws, target)
}

// only set if component has symbol & user entered symbol
function setSymbol(options, words) {
  if (!options.symbol) return

  const symbol = words.find((w) => /(?<=\$)[\w.]+/.test(w))
  if (symbol) options.symbol = symbol.slice(1)
}

// only set if component has time & user entered time
export function setTime(options, words, ws) {
  if (!options.time) return

  // find time
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  time = time ? time.slice(1) : options.time

  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    options.series = 'intra'
    options.time = intra[0]
    options._time = {
      chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1),
    }
  } else if (time == '1d') {
    options.time = time
    options.series = 'intra'
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
  options.time = time
}

export function exit(ws) {
  ws.printLines('{#abf-fg}\ngoodbye...{/}')
  setTimeout(() => {
    ws.options.screen.destroy()
    process.exit(0)
  }, 800)
}

function search(ws, words) {
  words = words.filter((w) => w != '?').join(' ')
  let results = fuzzySearch(words)
  results = results
    .map((r) => `{bold}{#ce4-fg}${r.obj.symbol}{/} ${r.obj.name}`)
    .join('\n')
  ws.printLines(results)
}
