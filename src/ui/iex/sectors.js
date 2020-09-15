import blessed from '@hp4k1h5/blessed'

import { shapeSectors } from '../../shape/shapeIex.js'
import { clear } from '../../util/clear.js'
import { spin } from '../../util/spin.js'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildSectors(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'sectors',
    label: `[${options.id}  sectors ${
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
  data = shapeSectors(data)
  if (!data) return
  options.box.setContent(data)
}
