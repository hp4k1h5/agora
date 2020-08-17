import blessed from 'blessed'

import { evaluate } from './evaluate.js'
import { intro } from './help.js'
import { exit } from './evaluate.js'

export function buildRepl(ws, options, _target, _data, _new) {
  ws.repl = ws.grid.set(...options.yxhw, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't
  // report
  options.output = blessed.text({
    parent: ws.repl,
    name: 'output',
    // inputs
    keys: false,
    mouse: true,
    scrollable: true,
    // display
    tags: true,
    height: '75%',
  })

  // add printLines to ws
  ws.printLines = function (text) {
    // accepts a array or string
    options.output.pushLine(text)
    options.output.setScrollPerc(100)
    // TODO: find less intensive way of rendering terminal output
    ws.screen.render()
  }

  // init welcome text
  ws.printLines(intro)

  // all repl function & interaction is handled here and in evaluate()
  const input = blessed.textbox({
    parent: ws.repl,
    name: 'input',
    // inputs
    inputOnFocus: true,
    // styles
    bottom: 0,
    height: 3,
    border: { type: 'line' },
    style: {
      border: { fg: 'gray' },
      focus: {
        border: { fg: [180, 180, 255] },
      },
    },
  })
  // add to focus stack
  ws.screen.focusPush(input)

  // handle keys

  input.unkey(['up', 'down'])

  input.key('C-c', function () {
    exit(ws)
  })
  // handle submit
  input.key('enter', function () {
    ws.repl.submit()
  })

  // handle submit
  ws.repl.on('submit', async function (data) {
    // print last command
    ws.printLines('{bold}> {/}' + data.input)
    input.clearValue()

    // parse and handle input
    await evaluate(ws, data.input)

    // wait to focus until evaluation completes
    input.focus()
  })
}
