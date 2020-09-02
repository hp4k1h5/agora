import blessed from '@hp4k1h5/blessed'

import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildBlank(ws, options) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'blank',
    label: `[${options.id}  blank ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    // inputs
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: false,
    scrollable: false,
    // styles
    tags: true,
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })
  // options.box.setData('type {yellow-fg}h{/} for help')
}
