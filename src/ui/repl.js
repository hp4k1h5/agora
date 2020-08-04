import blessed from 'blessed'

import { getPrices, getQuote } from '../api/api.js'
import { help, intro } from './help.js'
import { buildPriceVolCharts } from './graph.js'

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
    await evaluate(ws, ws.options.components[ws.activeComponent], data.input)

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

function evaluate(ws, c, input) {
  const commands = {
    undefined: update,
    '"': quote,
    help,
    h: help,
    exit,
    quit: exit,
  }

  let words = input.split(/\s+/g)

  // define command to execute
  let command = commands[words.find((w) => commands[w])]

  let symbol = words.find((w) => w[0] == '$')
  c.symbol = symbol ? symbol.substring(1) : c.symbol
  let time = words.find((w) => /(?<=:)\S/.test(w))
  // set c.time & c.series
  if (time) parseTime(c, time)

  // TODO
  // if (!c.symbol && !c.time) return `{red-fg}error: no known commands entered\n`

  // execute command
  return command(ws, c, words)
}

function exit(ws) {
  setTimeout(() => {
    console.log('exiting...')
    ws.screen.destroy()
    process.exit(0)
  }, 800)
  ws.printLines('{#abf-fg}goodbye...{/}')
}

export async function update(ws, component, init) {
  if (component.type == 'line') {
    let data
    if (!init) {
      data = await getPrices(ws, component)
    }
    buildPriceVolCharts(ws, component, data)
  } else if (component.type == 'repl') {
    buildRepl(ws, component)
  }
}

async function quote(self) {
  let data
  try {
    data = await getQuote(self.sym)
  } catch (e) {
    return `{red-fg}error: ${e.status > 400 ? '$' + self.sym : ''} ${
      e.statusText
    }{/}`
  }

  self.buildQuote(data)
}

/** time is a string, a valid number/interval combination, should not include
 * :-prefix*/
export function parseTime(c, time) {
  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    c.series = 'intra'
    c._time = { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
  } else {
    c.series = 'hist'
    c._time = time
  }
  c.time = time
}
