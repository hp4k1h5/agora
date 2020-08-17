import contrib from 'blessed-contrib'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildQuoteList(ws, c, target, data, _new) {
  if (_new) {
    target = ws.grid.set(...c.yxhw, contrib.table, {
      label: 'quote',
      columnSpacing: 3,
      columnWidth: [13, 30],
      input: true,
      interactive: false,
    })

    // match options with component
    target._id = c.id

    // add focus listeners
    ws.setListeners(ws, target)
  }

  // set data
  if (!data) return
  target.setData({ headers: data[0], data: data.slice(1) })
}
