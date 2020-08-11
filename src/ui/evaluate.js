import { update } from './update.js'
import { help } from './help.js'
import { defaults } from '../util/defaults.js'

export async function evaluate(ws, input) {
  const component = ws.activeComponent
  if (input == '') return update(ws, component)

  const commands = {
    undefined: update,
    '#': chart,
    '!': news,
    '=': watchlist,
    '&': profile,
    help,
    h: help,
    exit,
    quit: exit,
  }

  let words = input.split(/\s+/g)

  // define command to execute
  let command = commands[words.find((w) => commands[w])]

  // define params
  let symbol = words.find((w) => w[0] == '$')
  component.symbol = symbol ? symbol.substring(1) : component.symbol
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  // set c.time & c.series
  if (time) parseTime(ws, component, time)

  // if no command has been issued to change the components, run
  // update with new values if any have been provided, else error
  // with help
  if (command == commands[undefined] && !symbol && !time) {
    ws.printLines(`{red-fg}err:{/} no valid command found\r`)
    help(ws, component, ['help'])
    return
  }

  // execute command
  await command(ws, component, words)
}

async function profile(ws, activeComponent) {
  const componentOptions = findOrMakeAndUpdate(ws, 'profile', activeComponent)
  await update(ws, componentOptions)
}

async function watchlist(ws, activeComponent) {
  const componentOptions = findOrMakeAndUpdate(ws, 'watchlist', activeComponent)
  await update(ws, componentOptions)
}

async function chart(ws, activeComponent) {
  const chartType = ws.options.components.find(
    (c) => ['line'].includes(c.type).type,
  )
  const componentOptions = findOrMakeAndUpdate(ws, chartType, activeComponent)

  await update(ws, componentOptions)
}

async function news(ws, activeComponent) {
  const componentOptions = findOrMakeAndUpdate(ws, 'news', activeComponent)
  await update(ws, componentOptions)
}

// helpers
function findOrMakeAndUpdate(ws, type, activeComponent) {
  let componentOptions = ws.options.components.find((c) => c.type == type)

  if (!componentOptions) {
    if (!defaults[type]) {
      ws.printLines('{red-fg}err: no such component type{/}')
      return
    }
    componentOptions = defaults[type]
    ws.options.components.push(componentOptions)
  }

  ;['symbol', 'time'].forEach((key) => {
    componentOptions[key] = activeComponent[key]
  })
  if (activeComponent.time)
    parseTime(ws, componentOptions, activeComponent.time)

  ws.activeComponent = componentOptions

  return componentOptions
}

/** time is a string, a valid number/interval combination, should not include
 * :-prefix*/
export function parseTime(ws, c, time) {
  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    c.series = 'intra'
    c._time = { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
  } else if (time == '1d') {
    c.series = 'intra'
    c._time = { chartLast: 6.5 * 60 }
  } else {
    if (!ws.validUnits.includes(time.substring(1))) {
      ws.printLines(`{red-fg}err:{/} invalid time`)
      help(ws, c, ['h', ':'])
      return
    }
    c.series = 'hist'
    c._time = time.substring(1)
  }
  c.time = time
}

function exit(ws) {
  setTimeout(() => {
    ws.screen.destroy()
    process.exit(0)
  }, 800)
  ws.printLines('{#abf-fg}goodbye...{/}')
}
