import blessed from '@hp4k1h5/blessed'

import { shapeQuote } from '../../shape/shapeIex.js'
import { clear } from '../../util/clear.js'
import { spin } from '../../util/spin.js'

export function buildQuoteList(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'quote',
    label: `[${options.id}  quote ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    // inputs
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  data = shapeQuote(data)
  if (!data) return
  options.box.setContent(data)
}
