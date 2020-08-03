import blessed from 'blessed'

import { getPrices, getQuote } from '../api/api.js'
import { help } from './help.js'

const history = `{#2ea-fg}Welcome to iexcli.{/}
  Data provided by IEX Cloud 
  {blue-fg}<https://iexcloud.io>{/}

  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} for help. 

  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}...
\n\n\n `.split('\n')

export function buildRepl(ws, c) {
  const repl = ws.grid.set(...c.yxhw, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't report
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
  // init welcome text
  output.setValue(history.join('\n'))

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
        border: { fg: 'blue' },
      },
    },
  })

  // handle submit
  input.key('enter', function () {
    repl.submit()
  })
  repl.on('submit', async function (data) {
    // parse and handle input
    let evaluation = await evaluate(data.input, ws)

    // mimic scroll
    history.push('{bold}> {/}' + data.input)
    evaluation && history.push(evaluation)
    output.setValue(history.slice(-output.height).join('\n'))

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

function evaluate(input, self) {
  const commands = {
    undefined: update,
    '"': quote,
    help,
    h: help,
    exit,
    quit: exit,
  }

  let words = input.split(/\s+/g)
  let command = commands[words.find((w) => commands[w])]
  let sym = words.find((w) => w[0] == '$')
  self.sym = sym ? sym.substring(1) : self.sym
  let time = words.find((w) => /:\S/.test(w))
  if (time) time = parseTime(self, time.substring(1))
  if (time) return time

  if (!self.sym && !self.time)
    return `{red-fg}error: no known commands entered 
`
  // ${help()}

  // execute command
  return command(self, words)
}

function exit(self) {
  setTimeout(() => {
    self.screen.destroy()
    console.log('exiting...')
  }, 1000)
  return '{#abf-fg}goodbye...{/}'
}

async function update(self) {
  let data
  try {
    data = await getPrices(self)
    quote = await getQuote(self.sym)
  } catch (e) {
    return `{red-fg}error: ${e.status > 400 ? '$' + self.sym : ''} ${
      e.statusText
    }{/}`
  }

  self.buildCharts(data)
  self.buildQuote(quote)
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

export function parseTime(c) {
  // handle intraday
  const intra = c.time.match(/([\d.]+)(min|h)/)
  if (intra) {
    c.series = 'intra'
    return { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
  }

  c.series = 'hist'
  return time

  // handle historical
  // if (!self.validUnits.includes(time)) {
  //   return `{bold}{red-fg}error: invalid time{/}; see {#cd2-fg}help :{/}`
  // }
}
