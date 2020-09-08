import blessed from '@hp4k1h5/blessed'

import { carousel } from '../index.js'
import { evaluate } from './evaluate.js'
import { intro } from './help.js'
import { handleErr } from '../util/error.js'
import { exit } from './evaluate.js'

export function buildRepl(ws, options) {
  const [y, x, h, w] = options.yxhw

  // console display (optional), otherwise commands just have effects and don't
  // report
  const output = ws.grid.set(y, x, h - 1, w, blessed.text, {
    name: 'output',
    // inputs
    keys: false,
    input: false,
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
    ws.options.screen.render()
  }

  // init welcome text
  ws.printLines(intro)

  // all repl function & interaction is handled here and in evaluate()
  ws.input = ws.grid.set(y + (h - 1), x, 1, w, blessed.textbox, {
    name: 'input',
    // inputs
    inputOnFocus: true,
    // styles
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })

  const screen = ws.options.screen
  // app-wide return to repl hotkey
  screen.key('>', () => {
    ws.input.focus()
  })

  // exit from repl
  ws.input.key('C-c', function () {
    exit(ws)
  })

  ws.input.key('esc', function () {
    screen.focusNext()
  })
  // handle submit
  ws.input.key('enter', function () {
    ws.input.submit()
  })

  // handle submit
  ws.input.on('submit', async function (data) {
    // print last command
    ws.printLines('{bold}> {/}' + data)
    ws.input.clearValue()

    // parse and handle input
    try {
      await evaluate(ws, data)
    } catch (e) {
      handleErr(ws, e)
    }

    // wait to focus until evaluation completes
    !ws.input.focused && ws.input.focus()
  })

  ws.input.on('focus', function () {
    output.setFront()
    ws.input.setFront()
  })
}
