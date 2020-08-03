import contrib from 'blessed-contrib'

export function graph(grid, data, label, row, col, h, w) {
  const minY = data ? Math.min(...data.y) : 0

  const line = grid.set(row, col, h, w, contrib.line, {
    style: {
      line: 'green',
      text: [180, 180, 120],
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
    showLegend: !!data.title,
  })

  data && line.setData([data])
}
