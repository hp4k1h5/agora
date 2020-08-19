import blessed from 'blessed'

import { clear } from '../util/clear.js'

export function buildProfile(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'profile',
    label: `[${options.id} profile]`,
    keys: false,
    input: true,
    mouse: false,
    scrollable: false,
    tags: true,
    style: {
      focus: { border: { fg: '#ddf' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  const width = Math.floor(options.box.width / 2) - 1
  const heightHalf = Math.floor(options.box.height / 2) - 1

  const company = blessed.text({
    parent: options.box,
    name: 'company',
    label: 'company',
    // inputs
    mouse: true,
    scrollable: true,
    width,
    height: heightHalf + 3,
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

  // set data
  if (!data) return
  company.setContent(data.company)
  keyStats.setContent(data.keyStats)
  earnings.setContent(data.earnings)
}
