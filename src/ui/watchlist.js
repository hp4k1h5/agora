import blessed from 'blessed'

export function buildWatchlist(ws, component, data) {
  // set active component
  if (ws.activeComponent) ws.screen.remove(ws.activeComponent)
  ws.activeComponent = component

  // restored by tab/esc
  // ws.screen.saveFocus()

  if (ws.watchlist) ws.screen.remove(ws.watchlist)

  // set contrib options
  ws.watchlist = ws.grid.set(...component.yxhw, blessed.listtable, {
    // inputs
    keys: true,
    mouse: true,
    scrollable: true,
    interactive: true,
    // styles
    tags: true,
    noCellBorders: true,
    invertSelected: false,
    style: {
      fg: '#ccd',
      border: { fg: '#77abee' },
      cell: {
        selected: { bg: '#00ff55', fg: '#101010' },
      },
    },
  })

  // set keys for screen
  ws.screen.onceKey(['escape', 'tab'], function () {
    // saved above
    // ws.screen.restoreFocus()
  })
  ws.screen.key(['up', 'down'], function (_ch, key) {
    if (key.name == 'up') ws.watchlist.up(1)
    else if (key.name == 'down') ws.watchlist.down(1)
    ws.watchlist.focus()
  })

  // set data
  if (!data) return
  ws.watchlist.setData(data)

  ws.watchlist.focus()
  ws.screen.render()
}
