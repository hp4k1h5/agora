import blessed from 'blessed'

import { getPrices, getQuote } from '../api/api.js'
import { help, intro } from './help.js'
import { buildPriceVolCharts } from './graph.js'
import { buildQuoteList } from './quote.js'

function buildRepl(ws, c) {
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

    // parse and handle input
    await evaluate(ws, data.input)

    // clear input and refocus
    input.clearValue()
    input.focus()
    ws.screen.render()
  })

  input.focus()
  // add to curScreen
  ws.repl = repl
  ws.screen.render()
}

// helpers

function evaluate(ws, input) {
  const commands = {
    undefined: update,
    help,
    h: help,
    exit,
    quit: exit,
  }
  const component = ws.activeComponent

  let words = input.split(/\s+/g)

  // define command to execute
  let command = commands[words.find((w) => commands[w])]

  let symbol = words.find((w) => w[0] == '$')
  component.symbol = symbol ? symbol.substring(1) : component.symbol
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  // set c.time & c.series
  if (time) parseTime(ws, component, time)

  // execute command
  return command(ws, component, words)
}

function exit(ws) {
  setTimeout(() => {
    console.log('exiting...')
    ws.screen.destroy()
    process.exit(0)
  }, 800)
  ws.printLines('{#abf-fg}goodbye...{/}')
}

export async function update(ws, component) {
  if (component.type == 'line') {
    let data
    try {
      data = await getPrices(ws, component)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${e.status > 400 ? '$' + component.sym : ''} ${
          e.statusText
        }{/}`,
      )
    }
    buildPriceVolCharts(ws, component, data)

    // handle quote
    const quoteList = ws.options.components.find((c) => c.type == 'quote')
    if (!quoteList) return

    try {
      data = await getQuote(component.symbol)
    } catch (e) {
      ws.printLines(
        `{red-fg}error: ${e.status > 400 ? '$' + component.sym : ''} ${
          e.statusText || e
        }{/}`,
      )
    }
    buildQuoteList(ws, quoteList, data)
  } else if (component.type == 'repl') {
    buildRepl(ws, component)
  }
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
