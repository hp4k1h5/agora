import blessed from 'blessed'

import { clear } from '../util/clear.js'

export function buildWatchlist(ws, options, data) {
  clear(ws, options)
  options.box = ws.grid.set(...options.yxhw, blessed.listtable, {
    name: 'watchlist',
    label: `[${options.id} watchlist]`,
    // inputs
    input: true,
    keys: false,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    noCellBorders: true,
    invertSelected: false,
    style: {
      fg: '#ccd',
      cell: {
        selected: { bg: '#00cc55', fg: '#707070' },
      },
    },
  })
  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  options.box.setData(data)
}
