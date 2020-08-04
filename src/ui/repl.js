import blessed from 'blessed'

import { getPrices, getQuote } from '../api/api.js'
import { help, intro } from './help.js'

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
  c.history = []

  // add printLines to c
  c.printLines = function (c, text) {
    c.history.push(...text)
    c.output.setValue(c.history.slice(-c.output.height).join('\n'))
  }

  // init welcome text
  c.printLines(c, intro)

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
    c.printLines(c, ['{bold}> {/}' + data.input])
    // parse and handle input
    let evaluation = await evaluate(
      ws,
      ws.options.components[ws.activeComponent],
      data.input,
    )

    // mimic scroll
    // push response to history
    evaluation && c.printLines(c, evaluation.split('\n'))
    //
    output.setValue(c.history.slice(-output.height).join('\n'))

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
  let time = words.find((w) => /:(?<=\S)/.test(w))
  if (time) c.time = parseTime(c, time)

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
  return '{#abf-fg}goodbye...{/}'
}

async function update(ws, c, words) {
  let data
  try {
    data = await getPrices(ws, c)
    // quote = await getQuote(ws.sym)
  } catch (e) {
    c.printLines(c, [
      `{red-fg}error: ${e.status > 400 ? '$' + ws.sym : ''} ${e.statusText}{/}`,
    ])
  }

  ws.buildPriceVolCharts(ws, c, data)
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

export function parseTime(c, time) {
  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    c.series = 'intra'
    return { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
  }

  c.series = 'hist'
  c.time = time
  return time

  // handle historical
  // if (!self.validUnits.includes(time)) {
  //   return `{bold}{red-fg}error: invalid time{/}; see {#cd2-fg}help :{/}`
  // }
}
