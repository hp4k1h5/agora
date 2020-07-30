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
    this.series = 'intra'
    this.validUnits = ['5d', '1m', '3m', '6m', 'ytd', '1y', '5y', 'max']
    this.time = { chartLast: 60 * 6.5 } // one day
  }

  buildRepl(row, col, h, w) {
    buildRepl.apply(this, arguments)
  }

  buildQuote(data) {
    // set contrib options
    if (!this.quote)
      this.quote = this.grid.set(0, 9, 6, 3, contrib.table, {
        columnSpacing: 6,
        columnWidth: [13, 30],
        keys: true,
        interactive: true,
      })

    // set data
    this.quote.setData({ headers: data[0], data: data.slice(1) })

    this.screen.render()
  }

  buildCharts(data) {
    // add line graph
    if (!this.priceChart)
      this.priceChart = graph(this.grid, data, 'time series', 0, 0, 10, 9)
    else {
      this.screen.remove(this.priceChart)
      this.priceChart = graph(this.grid, data, 'time series', 0, 0, 10, 9)
    }
    // this.screen.render()

    // add vol graph
    const volData = { x: data.x, y: data.vol, style: { line: [110, 180, 250] } }
    if (!this.volChart)
      this.volChart = graph(this.grid, volData, 'volume', 10, 0, 3, 9)
    else {
      this.screen.remove(this.volChart)
      this.volChart = graph(this.grid, volData, 'volume', 10, 0, 3, 9)
    }
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
