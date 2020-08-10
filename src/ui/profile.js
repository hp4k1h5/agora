import blessed from 'blessed'

export function buildProfile(ws, component, data) {
  // set active component
  ws.activeComponent = component
  // restored by tab/esc
  ws.screen.saveFocus()

  // set contrib options
  ws.watchlist = ws.grid.set(...component.yxhw, blessed.table, {
    keys: true,
    mouse: true,
    tags: true,
    input: true,
    scrollable: true,
    style: {
      fg: 'blue',
      border: { fg: '#77abee' },
      // focus: { bg: '#77eeab' },
    },
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
