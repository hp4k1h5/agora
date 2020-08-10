import contrib from 'blessed-contrib'

export function buildNewsList(ws, component, data) {
  // remove active component
  if (ws.activeComponent) ws.screen.remove(ws.activeComponent)
  // set active component
  ws.activeComponent = component

  // restored by tab/esc
  ws.screen.saveFocus()

  // clear screen
  if (ws.newsList) ws.screen.remove(ws.newsList)

  // set contrib options
  ws.newsList = ws.grid.set(...component.yxhw, contrib.table, {
    title: 'news',
    // inputs
    keys: true,
    interactive: true,
    mouse: true,
    // styles
    columnSpacing: 2,
    columnWidth: [9, 200],
  })

  // set keys for screen
  ws.screen.onceKey(['escape', 'tab'], function () {
    // saved above
    ws.screen.restoreFocus()
  })

  // set data
  if (!data) return
  ws.newsList.setData({
    headers: [
      'News',
      component.symbol +
        '      ? hit tab or esc to return to repl, use arrow keys to scroll',
    ],
    data,
  })
  ws.newsList.focus()

  ws.screen.render()
}
