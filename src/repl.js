import blessed from 'blessed'
import { getPrices, getQuote } from './api.js'

export function buildRepl(row, col, h, w) {
  const self = this
  const history = `{#2ea-fg}Welcome to iexcli.{/}
  Data provided by IEX Cloud 
  {blue-fg}<https://iexcloud.io>{/}

  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} for help. 

  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}...
\n\n\n `.split('\n')

  const repl = this.grid.set(row, col, h, w, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't report
  const output = blessed.textarea({
    parent: repl,
    height: '80%',
    tags: true,
    style: {
      scrollbar: {
        bg: 'blue',
      },
    },
  })
  // init welcome text
  output.setValue(history.join('\n'))

  // non-optional all interaction is handled here
  const input = blessed.textbox({
    parent: repl,
    name: 'input',
    top: '80%',
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
    let evaluation = await evaluate(data.input, self)

    // mimic scroll
    history.push('{bold}> {/}' + data.input)
    evaluation && history.push(evaluation)
    output.setValue(history.slice(-output.height).join('\n'))

    // clear input and refocus
    input.clearValue()
    input.focus()
    self.screen.render()
  })

  input.focus()
  // add to curScreen
  this.repl = repl
  this.screen.render()
}

// helpers

function evaluate(input, self) {
  const commands = {
    undefined: update,
    '"': quote,
    help,
    h: help,
  }

  let words = input.split(/\s+/g)
  let command = commands[words.find((w) => commands[w])]
  let sym = words.find((w) => w[0] == '$')
  self.sym = sym ? sym.substring(1) : self.sym
  let time = words.find((w) => w[0] == ':')
  if (time) time = parseTime(self, time.substring(1))
  if (time) return time

  if (!sym && !time)
    return `{red-fg}error: no known commands entered 
${help()}`

  // execute command
  return command(self, input)
}

function help(_self, words) {
  let what = words[words.findIndex('help') + 1]
  if (what) {
    const whats = {
      $: whatSym,
      ':': whatTime,
    }
    const whatSym = `{bold}{#2ea-fg}help {#cd2-fg}\${/} (symbol)
prefix stock ticker symbols with {#cd2-fg}\${/} to change the active symbol. Including a $-prefix will automatically update all charts and tables`
    const whatTime = `{bold}{#2ea-fg}help {#cd2-fg}:{/} (time range)
prefix valid time ranges with {#cd2-fg}:{/} to change the active time range. Including a :-prefix will automatically update all the charts and tables`
    return whats[what]
  }
  return `
    {bold}{#2ea-fg}help menu{/} 
{bold}available commands:{/}
{#cd2-fg}h(elp){/}   :prints this menu
{#cd2-fg}show{/}     :display new chart
{#cd2-fg}\${/}        :ticker symbol prefix
          changes active symbol
          ex. {#cd2-fg}$qqq{/}
          try {#cd2-fg}help \${/}
{#cd2-fg}\:{/}        :time (range) prefix
          changes active time range
          ex. {#cd2-fg}:6m{/}
          try {#cd2-fg}help \:{/}`
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

function parseTime(self, time) {
  // handle intraday
  const intra = time.match(/(\d+)(min|h)/)
  if (intra) {
    self.series = 'intra'
    self.time = { chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1) }
    return
  }

  // handle historical
  if (!self.validUnits.includes(time)) {
    return `{bold}{red-fg}error: invalid time{/}
  valid time units 
  ${self.validUnits.join(',')}
  && 1-100h, 1-1000min`
  }

  self.series = 'hist'
  self.time = time
}
