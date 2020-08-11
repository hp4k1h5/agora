import { update } from './update.js'
import { help } from './help.js'

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

// helpers

async function profile(ws, component) {
  let profileOptions = ws.options.components.find((c) => c.type == 'profile')
  if (!profileOptions) {
    profileOptions = {
      type: 'profile',
      yxhw: [0, 0, 12, 9],
      symbol: component.symbol,
    }
    ws.options.components.push(profileOptions)
  }

  await update(ws, profileOptions)
}

async function watchlist(ws, component) {
  let listOptions = ws.options.components.find((c) => c.type == 'watchlist')
  if (!listOptions) {
    listOptions = {
      type: 'watchlist',
      yxhw: [0, 0, 12, 9],
      symbol: component.symbol,
    }
    ws.options.components.push(listOptions)
  }

  await update(ws, listOptions)
}

async function chart(ws, component) {
  let chartOptions = ws.options.components.find((c) =>
    ['line'].includes(c.type),
  )
  chartOptions.symbol = component.symbol
  if (component.time) parseTime(ws, chartOptions, component.time)

  await update(ws, chartOptions)
}

async function news(ws, component) {
  let newsOptions = ws.options.components.find((c) => c.type == 'news')
  if (!newsOptions) {
    newsOptions = {
      type: 'news',
      symbol: component.symbol,
      yxhw: [0, 0, 12, 9],
    }
    ws.options.components.push(newsOptions)
  } else {
    newsOptions.symbol = component.symbol
    newsOptions.time = component.time
  }

  await update(ws, newsOptions)
}

/** time is a string, a valid number/interval combination, should not include
 * :-prefix*/
export function parseTime(ws, c, time) {
  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    c.series = 'intra'
    c._time = { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
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
