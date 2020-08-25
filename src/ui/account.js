import blessed from '@hp4k1h5/blessed'

import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

export function buildAccount(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'account',
    label: `[${options.id}  account ${
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

  // add focus listeners
  ws.setListeners(options)

  const width = Math.floor(options.box.width / 2) - 1

  const account = blessed.text({
    parent: options.box,
    name: 'account',
    label: 'account',
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

  const positions = blessed.text({
    parent: options.box,
    name: 'positions',
    label: 'positions',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    width,
    left: width,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  if (!data) return
  account.setContent(data.account)
  positions.setContent(data.positions)
}
