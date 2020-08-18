import { defaults } from '../util/defaults.js'
import { validUnits } from '../util/config.js'
import { update } from './update.js'
import { search as fuzzySearch } from './search.js'
import { help } from './help.js'

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
  }

  // parse input
  const words = input.split(/\s+/g)
  // find any commands
  const command = commands[words.find((w) => commands[w])]
  // execute repl fns first
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
  } else {
    target = defaults[command] || defaults.chart
    target.id = ws.id()
  }

  // set component type and options
  target.type = command || target.type
  setSymbol(target, words)
  setTime(target, words)

  await update(ws, target)
}

// only set if component has symbol & user entered symbol
function setSymbol(options, words) {
  if (!options.symbol) return

  const symbol = words.find((w) => /(?<=\$)[\w.]+/.test(w))
  if (symbol) options.symbol = symbol.slice(1)
}

// only set if component has time & user entered time
export function setTime(ws, componentOptions, words) {
  if (!componentOptions.time) return

  // find time
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  if (!time) return
  time = time.slice(1)

  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    componentOptions.series = 'intra'
    componentOptions._time = {
      chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1),
    }
  } else if (time == '1d') {
    componentOptions.series = 'intra'
    componentOptions._time = { chartLast: 1000 }
  } else {
    // handle historical
    if (!validUnits.includes(time.substring(1))) {
      ws.printLines(`{red-fg}err:{/} invalid time`)
      help(ws, c, ['h', ':'])
      return
    }
    componentOptions.series = 'hist'
    componentOptions._time = time.substring(1)
  }
  componentOptions.time = time
}

export function exit(ws) {
  ws.printLines('{#abf-fg}goodbye...{/}')
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
