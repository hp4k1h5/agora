import blessed from 'blessed'

import { evaluate } from './evaluate.js'
import { intro } from './help.js'
import { exit } from './evaluate.js'

export function buildRepl(ws, options, _target, _data, _new) {
  const [y, x, h, w] = options.yxhw

  // console display (optional), otherwise commands just have effects and don't
  // report
  const output = ws.grid.set(y, x, h - 1, w, blessed.text, {
    name: 'output',
    // inputs
    keys: false,
    mouse: true,
    scrollable: true,
    // display
    tags: true,
  })

  // add printLines to ws
  ws.printLines = function (text) {
    // accepts a array or string
    output.pushLine(text)
    output.setScrollPerc(100)
    // TODO: find less intensive way of rendering terminal output
    ws.screen.render()
  }

  // init welcome text
  ws.printLines(intro)

  // all repl function & interaction is handled here and in evaluate()
  const input = ws.grid.set(y + 5, x, 1, w, blessed.textbox, {
    name: 'input',
    // inputs
    inputOnFocus: true,
    // styles
    border: { type: 'line' },
    style: {
      border: { fg: 'gray' },
      focus: {
        border: { fg: [180, 180, 255] },
      },
    },
  })
  // add to focus stack
  // ws.setListeners(ws, input)
  ws.screen.focusPush(input)

  // handle keys

  input.unkey(['up', 'down'])

  input.key('C-c', function () {
    exit(ws)
  })
  // handle submit
  input.key('enter', function () {
    input.submit()
  })

  // handle submit
  input.on('submit', async function (data) {
    // print last command
    ws.printLines('{bold}> {/}' + data)
    input.clearValue()

    // parse and handle input
    await evaluate(ws, data)

    // wait to focus until evaluation completes
    input.focus()
  })
}
