import contrib from 'blessed-contrib'

export function graph(grid, data, label, row, col, h, w) {
  const line = grid.set(row, col, h, w, contrib.line, {
    style: {
      line: 'green',
      text: [180, 180, 120],
      baseline: 'blue',
    },
    minY: Math.min(...data.y),
    xLabelPadding: 0,
    yLabelPadding: 0,
    xPadding: 0,
    yPadding: 0,
    label,
    wholeNumbersOnly: false,
    showLegend: !!data.title,
  })

  line.setData([data])
}
