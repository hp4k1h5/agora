import blessed from '@hp4k1h5/blessed'

import { shapeProfile } from '../../shape/shapeIex.js'
import { clear } from '../../util/clear.js'
import { spin } from '../../util/spin.js'

export function buildProfile(ws, options, data = {}) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'profile',
    label: `[${options.id}  profile ${
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

  const dataLen = Object.keys(data).length - 1
  const width = Math.floor(options.box.width / dataLen) - 1
  const heightHalf = Math.floor(options.box.height / 2) - 1

  const company = blessed.text({
    parent: options.box,
    name: 'company',
    label: 'company',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    width,
    height: heightHalf + 3,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const earnings = blessed.text({
    parent: options.box,
    name: 'earnings',
    label: 'earnings',
    // inputs
    mouse: true,
    scrollable: true,
    // style
    width,
    top: heightHalf + 3,
    height: heightHalf - 3,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const keyStats = blessed.text({
    parent: options.box,
    name: 'stats',
    label: 'stats',
    // inputs
    mouse: true,
    scrollable: true,
    // style
    width,
    left: width,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const financials = blessed.text({
    parent: options.box,
    name: 'financials',
    label: 'financials',
    // inputs
    mouse: true,
    scrollable: true,
    // style
    width,
    left: width * 2,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  // set data
  if (!data || !data.length) return
  data = shapeProfile(data)
  company.setContent(data.company)
  earnings.setContent(data.earnings)
  keyStats.setContent(data.keyStats)
  financials.setContent(data.financials)
}
