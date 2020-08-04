import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, c, data) {
  // clear graph and add line graph
  if (ws.priceChart) ws.screen.remove(ws.priceChart)
  ws.priceChart = graph(ws.grid, data ? data.price : data, 'price', ...c.yxhw)

  // clear vol and add vol graph
  if (ws.volChart) ws.screen.remove(ws.volChart)
  if (!c.vol) return

  const [y, x, h, w] = c.yxhw
  ws.volChart = graph(
    ws.grid,
    data ? data.vol : data,
    'volume',
    y + h,
    x,
    12 - (y + h),
    w,
  )

  ws.screen.render()
}

export function graph(grid, data, label, row, col, h, w) {
  const minY = data ? Math.min(...data.y) : 0

  const line = grid.set(row, col, h, w, contrib.line, {
    style: {
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
    },
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: data ? !!data.title : 'title',
  })
  data && line.setData([data])
}
