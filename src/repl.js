import blessed from 'blessed'

export function buildRepl(row, col, h, w) {
  const screen = this.screen
  const history = `{#2ea-fg}Welcome to iexcli.{/}
  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} followed by {bold}{#cd2-fg}<enter>{/} or {bold}{#cd2-fg}<return>{/} for help. 
  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}..{bold}{blink}.{/}
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
  repl.on('submit', function (data) {
    // parse and handle input
    let evaluation = evaluate(data.input)

    // mimic scroll
    history.push('{bold}> {/}' + data.input)
    evaluation && history.push(evaluation)
    output.setValue(history.slice(-output.height).join('\n'))

    // clear input and refocus
    input.clearValue()
    input.focus()
    screen.render()
  })

  // init repl
  input.focus()
  // screen.render()
  return repl
}

// helpers

function evaluate(input) {
  const commands = {
    h: help,
    help,
    undefined: update,
  }

  let words = input.split(/\s+/g)
  let command = commands[words.find((w) => commands[w])]
  let stock = words.find((w) => w[0] == '$')

  // execute command
  return command(stock)
}

function help() {
  return `
    {bold}{#2ea-fg}help menu{/} 
{bold}available commands:{/}
{#cd2-fg}h(elp){/}   :prints this menu
{#cd2-fg}show{/}     :display new chart
{#cd2-fg}\${/}        :stock ticker symbol prefix
          changes active symbol
          ex. {#cd2-fg}$hlys <enter>{/}`
}

function update() {}
