import blessed from '@hp4k1h5/blessed'

import { shapeBook } from '../shape/shapeIex.js'
import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildBook(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'book',
    label: `[${options.id}  book \$${options.symbol.toUpperCase()} ${
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

  const width = Math.floor(options.box.width / 2) - 1
  const height = Math.floor(options.box.height / 2) - 1

  const bids = blessed.text({
    parent: options.box,
    name: 'bids',
    label: `bids`,
    // inputs
    keys: false,
    input: false,
    mouse: true,
    scrollable: true,
    // styles
    height,
    width,
    tags: true,
    border: { type: 'line' },
    style: {
      fg: '#555',
      border: { fg: '#555' },
    },
  })

  const asks = blessed.text({
    parent: options.box,
    name: 'asks',
    label: 'asks',
    // inputs
    keys: false,
    input: false,
    mouse: true,
    scrollable: true,
    // styles
    left: width,
    height,
    width,
    tags: true,
    border: { type: 'line' },
    style: {
      fg: '#555',
      border: { fg: '#555' },
    },
  })

  const trades = blessed.text({
    parent: options.box,
    name: 'trades',
    label: 'trades',
    // inputs
    keys: false,
    input: false,
    mouse: true,
    scrollable: true,
    // styles
    height,
    top: height,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#555' },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  data = shapeBook(data)
  if (!data) return
  bids.setContent(data.bids)
  asks.setContent(data.asks)
  trades.setContent(data.trades)
}
