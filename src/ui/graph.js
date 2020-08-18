import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, options, data) {
  if (options.box) {
    ws.options.screen.remove(options.box)
  }
  if (options.volChart) {
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

  const line = ws.grid.set(row, col, height, width, contrib.line, {
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: data ? !!data.title : false,
    border: { style: 'bg' },
    input: label != 'volume',
    style: {
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
      focus: { border: { fg: '#ddf' } },
    },
  })
  data && line.setData([data])

  return line
}
