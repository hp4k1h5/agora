import blessed from '@hp4k1h5/blessed'
import contrib from '@hp4k1h5/blessed-contrib'

import { shapePrices } from '../shape/shapeIex.js'
import { spin } from '../util/spin.js'
import { clear } from '../util/clear.js'

export function buildPriceVolCharts(ws, options, data) {
  clear(ws, options)

  // graph price
  data = shapePrices(options, data)

  let priceData
  if (data) {
    if (data.indicators) {
      priceData = [data.price, ...data.indicators]
    } else {
      priceData = [data.price]
    }
  }

  options.box = ws.grid.set(...options.yxhw, blessed.box, {
    name: 'graph',
    label: `[${options.id}  graph ${
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

  ws.setListeners(options)

  // set price chart
  const bH =
    options.box.height - (options.vol ? Math.floor(options.box.height / 3) : 0)

  const bW = options.box.width - 2
  graph(ws, options.box, priceData, 0, 0, bH - 1, bW)

  if (!options.vol) return

  //  put vol beneath price
  graph(ws, options.box, data?.vol, bH - 1, 0, options.box.height - bH - 1, bW)
}

export function graph(ws, parent, data, row, col, height, width) {
  if (!data) {
    data = [{ title: 'no data', x: [0], y: [0] }]
  }

  const minY = data ? Math.min(...data[0].y) : 0

  const line = contrib.line({
    parent,
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    wholeNumbersOnly: false,
    abbreviate: true,
    showLegend: true,
    // inputs
    input: false,
    // styles
    top: row,
    height,
    width,
    style: {
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
    },
  })
  parent.append(line)

  line.setData(data)

  return line
}
