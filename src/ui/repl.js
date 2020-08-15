import blessed from 'blessed'

import { evaluate } from './evaluate.js'
import { intro } from './help.js'
import { exit } from './evaluate.js'

export function buildRepl(ws, c) {
  ws.repl = ws.grid.set(...c.yxhw, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't
  // report
  c.output = blessed.text({
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
    c.output.pushLine(text)
    c.output.setScrollPerc(100)
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

  input.unkey(['up', 'down'])

  input.key('C-c', function () {
    exit(ws)
  })
  // handle submit
  input.key('enter', function () {
    ws.repl.submit()
  })
  ws.repl.on('submit', async function (data) {
    // push last command
    ws.printLines('{bold}> {/}' + data.input)
    // clear input and refocus
    input.clearValue()
    input.focus()

    // parse and handle input
    await evaluate(ws, data.input)
  })
}
