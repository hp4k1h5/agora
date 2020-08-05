import contrib from 'blessed-contrib'

export function buildNewsList(ws, component, data) {
  // set active component
  ws.activeComponent = component
  // restored by tab/esc
  ws.screen.saveFocus()

  // set contrib options
  ws.newsList = ws.grid.set(...component.yxhw, contrib.table, {
    title: 'news',
    columnSpacing: 2,
    columnWidth: [9, 200],
    keys: true,
    interactive: true,
  })
  // TODO: may need to bring in forked blessed to allow more interaction
  // set keys for news
  // ws.newsList.key(['tab'], function () {
  //   ws.repl.focus()
  //   console.log('out')
  //   process.exit()
  // ws.newsList.emit('select')
  // })
  // ws.newsList.on('select', function (selection) {})

  // set keys for screen
  ws.screen.key(['escape', 'tab'], function () {
    // saved above
    ws.screen.restoreFocus()
  })

  // set data
  if (!data) return
  data = Object.values(data)
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
