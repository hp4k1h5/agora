import contrib from '@hp4k1h5/blessed-contrib'
import { spin } from '../util/spin.js'

import { clear } from '../util/clear.js'
export function buildPriceVolCharts(ws, options, data) {
  clear(ws, options)

  // graph price
  const [y, x, h, w] = options.yxhw

  let priceData
  if (data) {
    if (data.indicators) {
      priceData = [data.price, ...data.indicators]
    } else {
      priceData = [data.price]
    }
  }

  options.box = graph(
    ws,
    priceData,
    `[${options.id}  price ${options.pollMs ? ' .. polling ' + spin() : ''}]`,
    y,
    x,
    h - (options.vol ? 2 : 0),
    w,
  )
  ws.setListeners(options)

  if (!options.vol) return

  // put vol beneath price
  options.volChart = graph(
    ws,
    data ? [data.vol] : data,
    'volume',
    y + h - 2,
    x,
    2,
    w,
  )
}

export function graph(ws, data, label, row, col, height, width) {
  if (!data) {
    data = [{ title: 'no data', x: [0], y: [0] }]
  }

  const minY = data ? Math.min(...data[0].y) : 0

  const line = ws.grid.set(row, col, height, width, contrib.line, {
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: data ? !!data[0].title : false,
    // input is true for focus rotation for price but not for volume
    input: label != 'volume',
    style: {
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
      focus: { border: { fg: '#fc5' } },
    },
  })

  line.setData(data)

  return line
}
