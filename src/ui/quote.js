import blessed from 'blessed'

import { clear } from '../util/clear.js'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildQuoteList(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'quote',
    label: `[${options.id} quote]`,
    keys: false,
    input: true,
    mouse: true,
    scrollable: true,
    // interactive: false,
    tags: true,
    style: {
      focus: { border: { fg: '#ddf' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  options.box.setContent(data)
}
