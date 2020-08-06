import contrib from 'blessed-contrib'

export function buildWatchlist(ws, component, data) {
  // set active component
  ws.activeComponent = component
  // restored by tab/esc
  ws.screen.saveFocus()

  // set contrib options
  ws.watchlist = ws.grid.set(...component.yxhw, contrib.table, {
    label: 'watchlist',
    columnSpacing: 2,
    //         sym nam ope clo hi lo lat pre cha %
    columnWidth: [5, 10, 7, 7, 7, 7, 7, 7, 18, 18, 10, 20],
    keys: true,
    interactive: true,
  })

  // set keys for screen
  ws.screen.key(['escape', 'tab'], function () {
    // saved above
    ws.screen.restoreFocus()
  })

  // set data
  if (!data) return
  ws.watchlist.setData({
    headers: data[0],
    data: data.slice(1),
  })
  ws.watchlist.focus()

  ws.screen.render()
}
