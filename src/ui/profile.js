import blessed from 'blessed'

export function buildProfile(ws, component, data) {
  // set active component
  ws.activeComponent = component
  // restored by tab/esc
  ws.screen.saveFocus()

  // set contrib options
  ws.watchlist = ws.grid.set(...component.yxhw, blessed.box, {
    keys: false,
    mouse: false,
    tags: true,
    input: false,
    scrollable: false,
  })

  // set keys for screen
  ws.screen.onceKey(['escape', 'tab'], function () {
    // saved above
    ws.screen.restoreFocus()
  })

  // set data
  if (!data) return
  ws.watchlist.setData(data)

  // ws.watchlist.focus()
  ws.screen.render()
}
