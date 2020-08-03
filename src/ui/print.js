import contrib from 'blessed-contrib'

import { graph } from './graph.js'
import { buildRepl } from './repl.js'

const builders = {
  line: buildCharts,
}

/*
 * blessed-contrib grid controller
 * */
export class Workspace {
  constructor(screen, options) {
    this.screen = screen
    this.options = options
    // e.g. this.grid.set(row, col, rowSpan, colSpan, obj, opts)
    this.validUnits = ['5d', '1m', '3m', '6m', 'ytd', '1y', '5y', 'max']
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
      builders[c.type] && builders[c.type]()
    })
  }

  buildRepl(_row, _col, _h, _w) {
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

    if (!data) return

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
