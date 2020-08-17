import blessed from 'blessed'

export function buildWatchlist(ws, c, target, data, _new) {
  if (_new) {
    target = ws.grid.set(...c.yxhw, blessed.listtable, {
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
        cell: {
          selected: { bg: '#00cc55', fg: '#707070' },
        },
      },
    })
  }

  // set data
  if (!data) return
  target.setData(data)
}
