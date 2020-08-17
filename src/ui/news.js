import contrib from 'blessed-contrib'

export function buildNewsList(ws, c, target, data, _new) {
  // clear screen
  if (_new) {
    target = ws.grid.set(...c.yxhw, contrib.table, {
      title: 'news',
      // inputs
      keys: false,
      interactive: false,
      mouse: true,
      // styles
      columnSpacing: 2,
      columnWidth: [9, 200],
    })
    // add to focus stack
    ws.screen.focusPush(ws.newsList)
  }

  // set data
  if (!data) return
  target.setData({
    headers: [
      'News',
      c.symbol +
        '      ? hit tab or esc to return to repl, use arrow keys to scroll',
    ],
    data,
  })
}
