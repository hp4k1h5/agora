import blessed from '@hp4k1h5/blessed'

import { shapeBots } from '../shape/shapeBots.js'
import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

export function buildBots(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'bots',
    label: `[${options.id}  bots ${
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

  // set data
  if (!data) {
    data = shapeBots()
  }

  options.box.setContent(data)
  ws.options.screen.render()
}
