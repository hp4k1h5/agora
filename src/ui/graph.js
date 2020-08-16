import blessed from 'blessed'
import contrib from 'blessed-contrib'

export function buildPriceVolCharts(ws, c, data) {
  const chartBox = ws.grid.set(...c.yxhw, blessed.box, { keys: true })

  // clear graph and add line graph
  if (c.priceChart) ws.screen.remove(c.priceChart)
  c.priceChart = graph(chartBox, data ? data.price : data, 'price', ...c.yxhw)

  ws.screen.focusPush(c.priceChart)

  // clear vol and add vol graph
  if (c.volChart) ws.screen.remove(ws.volChart)
  if (!c.vol) return

  // put vol beneath price
  const [y, x, h, w] = c.yxhw
  c.volChart = graph(
    chartBox,
    data ? data.vol : data,
    'volume',
    y + h,
    x,
    12 - (y + h),
    w,
  )
}

export function graph(chartBox, data, label, row, col, h, w) {
  const minY = data ? Math.min(...data.y) : 0

  const line = contrib.line({
    parent: chartBox,
    minY,
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: data ? !!data.title : false,
    input: true,
    keys: true,
    height: '50%',
    style: {
      border: { type: 'line', fg: '#4ac' },
      line: [100, 100, 100],
      text: [180, 220, 180],
      baseline: [100, 100, 100],
      bold: true,
      focus: { border: { fg: '#ccc' } },
    },
  })
  data && line.setData([data])

  return line
}
