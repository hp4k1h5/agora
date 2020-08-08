import blessed from 'blessed'

import { help, intro } from './help.js'
import { update } from './update.js'

export function buildRepl(ws, c) {
  const repl = ws.grid.set(...c.yxhw, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't
  // report
  const output = blessed.textarea({
    parent: repl,
    name: 'output',
    height: '75%',
    tags: true,
    style: {
      scrollbar: {
        bg: 'blue',
      },
    },
  })
  c.output = output
  // init repl history
  const history = []

  // add printLines to c
  ws.printLines = function (text) {
    if (typeof text == 'string') text = text.split('\n')
    history.push(...text)
    output.setValue(history.slice(-output.height).join('\n'))
  }

  // init welcome text
  ws.printLines(intro)

  // all interaction is handled here
  const input = blessed.textbox({
    parent: repl,
    name: 'input',
    bottom: 0,
    height: 3,
    inputOnFocus: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'gray' },
      focus: {
        border: { fg: [180, 180, 255] },
      },
    },
  })

  // handle submit
  input.key('enter', function () {
    repl.submit()
  })
  repl.on('submit', async function (data) {
    // push last command
    ws.printLines('{bold}> {/}' + data.input)
    // clear input and refocus
    input.clearValue()
    input.focus()

    // parse and handle input
    await evaluate(ws, data.input)

    ws.screen.render()
  })

  input.focus()
  // add to curScreen
  ws.repl = repl
  ws.screen.render()
}

// helpers

async function evaluate(ws, input) {
  const commands = {
    undefined: update,
    '#': chart,
    '!': news,
    '=': watchlist,
    help,
    h: help,
    exit,
    quit: exit,
  }
  const component = ws.activeComponent

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
