import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { graph } from './graph.js'
import { buildRepl } from './repl.js'

/*
 * blessed-contrib grid controller
 * */
export class UI {
  constructor(id, name, screen, sym) {
    this.id = id
    this.name = name
    this.screen = screen
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })
    // e.g. this.grid.set(row, col, rowSpan, colSpan, obj, opts)
    this.sym = sym
  }

  buildRepl(row, col, h, w) {
    buildRepl.apply(this, arguments)
  }

  buildQuote(data) {
    // set contrib options
    this.quote = this.grid.set(0, 9, 6, 3, contrib.table, {
      columnSpacing: 10,
      columnWidth: [13, 20],
      keys: true,
      interactive: true,
    })
    // set data
    this.quote.setData({ headers: data[0], data: data.slice(1) })

    this.screen.render()
  }

  buildCharts(data) {
    // add line graph
    this.priceChart = graph(this.grid, data, 'time series', 0, 0, 10, 9)

    // add vol graph
    this.volChart = graph(
      this.grid,
      { x: data.x, y: data.vol, style: { line: [110, 180, 250] } },
      'volume',
      9,
      0,
      3,
      9,
    )
    this.screen.render()
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
