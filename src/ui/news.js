import blessed from '@hp4k1h5/blessed'

import { shapeNews } from '../shape/shapeIex.js'
import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

export function buildNewsList(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'news',
    label: `[${options.id}  news ${
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
      fg: [60, 200, 250],
      focus: { border: { fg: '#fc5' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  data = shapeNews(data)
  if (!data) return
  options.box.setContent([`{#bf6-fg}${options.symbol}{/}`, data].join('\n'))
}
