import blessed from '@hp4k1h5/blessed'

import { clear } from '../util/clear.js'

export function buildNewsList(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'news',
    label: `[${options.id} news]`,
    // inputs
    keys: false,
    input: false,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    style: {
      fg: [60, 200, 250],
      focus: { border: { fg: '#ddf' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  options.box.setContent([`{#bf6-fg}${options.symbol}{/}`, data].join('\n'))
}
