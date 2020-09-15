import blessed from '@hp4k1h5/blessed'

import { shapeLists } from '../../shape/shapeIex.js'
import { clear } from '../../util/clear.js'
import { spin } from '../../util/spin.js'

export function buildLists(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'list',
    label: `[${options.id}  list ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: false,
    scrollable: false,
    tags: true,
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  data = shapeLists(data, options.listTypes)
  if (!data) return

  const width = Math.floor(options.box.width / options.listTypes.length)

  options.listTypes.forEach((type, i) => {
    const list = blessed.text({
      parent: options.box,
      name: type,
      label: type,
      // inputs
      mouse: true,
      scrollable: true,
      left: options.yxhw[1] + i * width,
      width,
      tags: true,
      border: { type: 'line' },
      style: {
        border: { fg: '#44bbee' },
      },
    })

    list.setContent(data[type])
  })
}
