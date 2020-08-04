import contrib from 'blessed-contrib'

import { update, parseTime } from './repl.js'

// data = {
//   title: 'data',
//   x: [1, 2, 3, 4, 5, 6, 7],
//   y: [1, 2, 3, 4, 5, 6, 7],
//   vol: [1, 2, 3, 4, 5, 6, 7],
// }

/*
 * blessed-contrib grid controller
 * */
export class Workspace {
  constructor(screen, options) {
    this.screen = screen
    this.options = options
    // e.g. this.grid.set(row, col, rowSpan, colSpan, obj, opts)
    this.validUnits = ['5d', '1m', '3m', '6m', 'ytd', '1y', '5y', 'max']
    this.activeComponent = 0
  }

  /** called by Carousel.workspaces once per Carousel "page", or
   * "workspace", as this package defines them. Exists to pass screen to a grid.
   *
   * each workspace defined in config instantiates a new grid, that
   * is called on switch screens.
   * */
  init(screen) {
    const ws = screen._ws
    ws.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen,
    })

    ws.options.components.forEach((c) => {
      // handle options
      c.time && parseTime(c, c.time)
      update(ws, c, true)
    })
  }
}

// [
//         ['msft', 10],
//         ['google', 1032],
//         ['tsla'],
//         ['amzn'],
//         ['aapl'],
//         ['goog'],
//         ['spy'],
//         ['qqq'],
//       ]
//
//
//   buildQuote(data) {
//     // set contrib options
//     if (!this.quote)
//       this.quote = this.grid.set(0, 9, 6, 3, contrib.table, {
//         columnSpacing: 6,
//         columnWidth: [13, 30],
//         keys: true,
//         interactive: true,
//       })

//     if (!data) return

//     // set data
//     this.quote.setData({ headers: data[0], data: data.slice(1) })

//     this.screen.render()
//   }
