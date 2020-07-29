import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { graph } from './graph.js'
import { buildRepl } from './repl.js'

/*
 * blessed-contrib grid controller
 * */
export class UI {
  constructor(id, name, screen) {
    this.id = id
    this.name = name
    this.screen = screen
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })
    // e.g. grid.set(row, col, rowSpan, colSpan, obj, opts)
  }

  buildRepl(row, col, h, w) {
    buildRepl.apply(this, arguments)
  }

  // set grid items
  print(data) {
    this.buildRepl(6, 9, 6, 3)

    // add line graph
    graph(this.grid, data, 'time series', 0, 0, 10, 9)

    // add vol graph
    graph(
      this.grid,
      { x: data.x, y: data.vol, style: { line: [90, 140, 250] } },
      'volume',
      9,
      0,
      3,
      9,
    )

    // add stock list
    // table(
    //   this.grid,
    //   {
    //     headers: ['stonks'],
    //     data: [
    //       ['msft'],
    //       ['google'],
    //       ['tsla'],
    //       ['amzn'],
    //       ['aapl'],
    //       ['goog'],
    //       ['spy'],
    //       ['qqq'],
    //     ],
    //   },
    //   0,
    //   10,
    //   12,
    //   2,
    // )

    this.screen.render()
  }
}
