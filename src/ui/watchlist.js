// import contrib from 'blessed-contrib'
import blessed from 'blessed'
export function buildWatchlist(ws, component, data) {
  // set active component
  ws.activeComponent = component
  // restored by tab/esc
  ws.screen.saveFocus()

  // set contrib options
  ws.watchlist = ws.grid.set(...component.yxhw, blessed.table, {
    keys: true,
    mouse: true,
    tags: true,
    interactive: true,
    scrollable: true,
    alwaysScroll: true,
  })

  // set keys for screen
  ws.screen.key(['escape', 'tab'], function () {
    // saved above
    ws.screen.restoreFocus()
  })

  // set data
  if (!data) return
  ws.watchlist.setData(data)

  ws.watchlist.focus()
  ws.screen.render()
}
