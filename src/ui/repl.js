import blessed from 'blessed'

import { evaluate } from './evaluate.js'
import { intro } from './help.js'

export function buildRepl(ws, c) {
  const repl = ws.grid.set(...c.yxhw, blessed.form, { keys: true })

  // console display (optional), otherwise commands just have effects and don't
  // report
  const output = blessed.text({
    parent: repl,
    name: 'output',
    // inputs
    keys: false,
    mouse: true,
    scrollable: true,
    // display
    tags: true,
    height: '75%',
  })
  c.output = output

  // add printLines to c
  ws.printLines = function (text) {
    c.output.pushLine(text)
    c.output.setScrollPerc(100)
  }

  // init welcome text
  ws.printLines(intro)

  // all interaction is handled here
  const input = blessed.textbox({
    parent: repl,
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
