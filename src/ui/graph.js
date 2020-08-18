import blessed from 'blessed'
import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, options, data) {
  if (options.box) {
    ws.options.screen.remove(options.box)
  } else if (options.volChart) {
    ws.options.screen.remove(options.volChart)
  }

  // graph price
  const [y, x, h, w] = options.yxhw
  options.box = graph(
    ws,
    options,
    data ? data.price : data,
    options.id + ' price',
    y,
    x,
    h - 2,
    w,
  )
  ws.setListeners(options)

  if (!options.vol) return
  // put vol beneath price
  options.volChart = graph(
    ws,
    options,
    data ? data.vol : data,
    'volume',
    h - 2,
    x,
    2,
    w,
  )
}

export function graph(ws, options, data, label, row, col, height, width) {
  const minY = data ? Math.min(...data.y) : 0
  let line = label == 'price' ? options.priceChart : options.volChart

  line =
    line ||
    ws.grid.set(row, col, height, width, contrib.line, {
      minY,
      xLabelPadding: 0,
      yLabelPadding: 0,
      xPadding: 0,
      yPadding: 0,
      label,
      wholeNumbersOnly: false,
      showLegend: data ? !!data.title : false,
      tags: true,
      border: { style: 'bg' },
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
