import blessed from 'neo-blessed'

export function buildRepl() {
  const screen = this.screen
  const history = `{#2ea-fg}Welcome to iexcli.{/}
  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} followed by {bold}{#cd2-fg}<enter>{/} or {bold}{#cd2-fg}<return>{/} for help..{bold}{blink}.{/}
more documentation is available at <https://github.com/hp4k1h5/iexcli>`.split(
    '\n',
  )

  var form = blessed.form({
    parent: screen,
    keys: true,
    right: 0,
    bottom: 3,
    width: 60,
    height: 10,
    padding: 0,
    margin: 0,
  })

  // console display (optional), otherwise commands just have effects and don't report
  const output = blessed.textarea({
    parent: form,
    top: 0,
    left: 0,
    width: form.width,
    height: 10,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
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
    parent: form,
    name: 'input',
    bottom: -3,
    left: output.left,
    width: form.width,
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
    form.submit()
  })
  form.on('submit', function (data) {
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
  screen.render()
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
  return `available commands:
h(help)    :prints this menu
$          :stock ticker symbol prefix
            changes the active symbol
            ex: {#cd2-fg}$hlys{/}`
}

function update() {}
