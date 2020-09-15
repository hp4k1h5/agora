import blessed from '@hp4k1h5/blessed'

import { clear } from '../../util/clear.js'
import { spin } from '../../util/spin.js'
import { shapeActivities } from '../../shape/alpaca/activities.js'

export function buildActivities(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'FILL activities',
    label: `[${options.id}  activities ${
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

  const width = Math.floor(options.box.width / 3) - 1
  const height = options.box.height

  // set cumulative information
  const cumulative = blessed.box({
    parent: options.box,
    name: 'cumulative',
    label: 'cumulative',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    width,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const instruments = blessed.text({
    parent: options.box,
    name: 'instruments',
    label: 'instruments',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    left: width,
    width,
    height,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const trades = blessed.text({
    parent: options.box,
    name: 'trades',
    label: 'trades',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    left: width * 2,
    width,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  if (!data) return
  data = shapeActivities(data)
  cumulative.setContent(data.cumulative)
  instruments.setContent(data.instruments)
  trades.setContent(data.trades)
}
