import blessed from 'blessed'

import { clear } from '../util/clear.js'

export function buildWatchlist(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.listtable, {
    name: 'watchlist',
    // TODO: fix blessed listtable label if possible see data[] hack below
    // label: `[${options.id} watchlist]`,
    // inputs
    keys: false,
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
      focus: { border: { fg: '#ddf' } },
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
  data[0][0] = `[${options.id} watch]`
  options.box.setData(data)
}
