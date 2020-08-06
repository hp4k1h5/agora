import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, c, data) {
  // set active component
  ws.activeComponent = c
  // remove news list
  if (ws.newsList) ws.screen.remove(ws.newsList)

  // clear graph and add line graph
  if (c.priceChart) ws.screen.remove(c.priceChart)
  c.priceChart = graph(ws.grid, data ? data.price : data, 'price', ...c.yxhw)

  // clear vol and add vol graph
  if (c.volChart) ws.screen.remove(ws.volChart)
  if (!c.vol) return

  // put vol beneath price
  const [y, x, h, w] = c.yxhw
  c.volChart = graph(
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
    interactive: false,
  })
  data && line.setData([data])
}
