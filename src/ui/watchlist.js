import blessed from '@hp4k1h5/blessed'

import { shapeWatchlist } from '../shape/shapeIex.js'
import { clear } from '../util/clear.js'
// import { spin } from '../util/spin.js'

export function buildWatchlist(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.listtable, {
    name: 'watchlist',
    // TODO: fix blessed listtable label if possible see data[] hack below
    // label: `[${options.id} watchlist]`,
    // inputs
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    noCellBorders: true,
    invertSelected: false,
    pad: 1,
    border: { type: 'line' },
    style: {
      focus: { border: { fg: '#fc5' } },
      fg: '#ccd',
      cell: {
        selected: { bg: '#00cc55', fg: '#707070' },
      },
      header: { fg: '#aaf' },
    },
  })
  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  // alpaca shapes its own data
  if (!data.shaped) data = shapeWatchlist(data)
  data[0][0] = `[${options.id} watch]`
  options.box.setData(data)
}
