import blessed from 'blessed'
import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, c, target, data, _new) {
  if (_new) {
    target = ws.grid.set(...c.yxhw, blessed.box, { keys: true })
    ws.setListeners(ws, target)
    ws.screen.focusPush(target)
  }

  // graph price
  const [y, x, h, w] = c.yxhw
  graph(target, data ? data.price : data, 'price', y, x, h - 3, w)

  if (!c.vol) return
  // put vol beneath price
  graph(target, data ? data.vol : data, 'volume', y + h, x, 12 - (y + h), w)
}

export function graph(target, data, label, row, col, h, w) {
  const minY = data ? Math.min(...data.y) : 0

  const line = contrib.line({
    parent: target,
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: data ? !!data.title : false,
    height: h,
    style: {
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
    },
  })
  data && line.setData([data])

  return line
}
