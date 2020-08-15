import contrib from 'blessed-contrib'

export function buildNewsList(ws, component, data) {
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
  // add to focus stack
  ws.screen.focusPush(ws.newsList)

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
}
