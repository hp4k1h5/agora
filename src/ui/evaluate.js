import { defaults } from '../util/defaults.js'
import { validUnits } from '../util/config.js'
import { update } from './update.js'
import { search as fuzzySearch } from './search.js'
import { help } from './help.js'

export async function evaluate(ws, input) {
  // update when empty return is submitted
  if (input == '') return update(ws)

  // parse input
  let words = input.split(/\s+/g)

  // define command to execute
  const commands = {
    exit,
    quit: exit,
    help,
    h: help,
    undefined: update,
    '#': chart,
    '!': news,
    '=': watchlist,
    '&': profile,
    '?': search,
    '"': quote,
  }
  // find first command entered and ignore other potentially
  // conflicting ones. Command-prefixes are also handled separately
  // since they can be combined with regular commands
  let command = commands[words.find((w) => commands[w])]

  // if no command has been issued to change the components, run
  // update with new values if any have been provided, else error
  // with help
  // if (command == commands[undefined] && !symbol && !time) {
  //   help(ws, component, ['help'])
  //   ws.printLines(`{red-fg}err:{/} no valid command found\rScroll help above`)
  //   return
  // }

  // execute command
  await command(ws, words)
}

function search(ws, words) {
  words = words.filter((w) => w != '?').join(' ')
  let results = fuzzySearch(words)
  results = results
    .map((r) => `{bold}{#ce4-fg}${r.obj.symbol}{/} ${r.obj.name}`)
    .join('\n')
  ws.printLines(results)
}

async function quote(ws) {
  const componentOptions = findOrMakeAndUpdate(ws, 'quote')
  setSymbol(words, componentOptions)
  parseTime(ws, componentOptions, words)
}

async function profile(ws) {
  const componentOptions = findOrMakeAndUpdate(ws, 'profile')
  await update(ws, componentOptions)
}

async function watchlist(ws, activeComponent) {
  const componentOptions = findOrMakeAndUpdate(ws, 'watchlist', activeComponent)
  await update(ws, componentOptions)
}

async function chart(ws, activeComponent) {
  const chartType = ws.options.components.find((c) => ['line'].includes(c.type))
    .type
  const componentOptions = findOrMakeAndUpdate(ws, chartType, activeComponent)

  await update(ws, componentOptions)
}

async function news(ws, activeComponent) {
  const componentOptions = findOrMakeAndUpdate(ws, 'news', activeComponent)
  await update(ws, componentOptions)
}

// helpers
function findOrMakeAndUpdate(ws, type) {
  let componentOptions = ws.options.components.find((c) => c.type == type)

  if (!componentOptions) {
    if (!defaults[type]) {
      ws.printLines('{red-fg}err: no such component type{/}')
      return
    }
    componentOptions = defaults[type]
    componentOptions.id = ws.id()
    ws.options.components.push(componentOptions)
  }

  componentOptions.symbol = ws.activeSymbol
  componentOptions.time = ws.activeTime
  parseTime(ws, componentOptions, activeComponent.time)

  ws.activeComponent = componentOptions

  return componentOptions
}

/** time is a string, a valid number/interval combination, should not include
 * :-prefix*/
export function parseTime(ws, componentOptions, words) {
  // find time
  let time = words.find((w) => /(?<=:)\S+/.test(w))

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
    ws.screen.destroy()
    process.exit(0)
  }, 800)
}

function setSymbol(words, componentOptions) {
  // find symbol
  const symbol = words.find((w) => /(?<=\$)[\w.]+/.test(w))
  if (symbol) componentOptions.symbol = symbol
}
