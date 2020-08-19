import blessed from 'blessed'

import { clear } from '../util/clear.js'

export function buildNewsList(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'news',
    label: `[${options.id} news]`,
    // inputs
    keys: false,
    input: true,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    style: {
      fg: [60, 200, 250],
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  data =
    options.symbol +
    '      ? hit tab or esc to return to repl, use arrow keys to scroll\n' +
    data
  options.box.setContent(data)
}
