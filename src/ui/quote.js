import contrib from 'blessed-contrib'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildQuoteList(ws, component, data) {
  // set contrib options
  if (!ws.quote) {
    ws.quote = ws.grid.set(...component.yxhw, contrib.table, {
      columnSpacing: 6,
      columnWidth: [13, 30],
      keys: true,
      interactive: true,
    })
  }

  // set data
  if (!data) return
  ws.quote.setData({ headers: data[0], data: data.slice(1) })

  ws.screen.render()
}
