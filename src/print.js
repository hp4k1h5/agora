import blessed from 'neo-blessed'

import { graph } from './graph.js'
import { buildRepl } from './repl.js'

/*
 * neo-blessed contrib grid controller
 * */
export class UI {
  constructor(id, name, screen) {
    this.id = id
    this.name = name
    this.screen = screen
    // e.g. grid.set(row, col, rowSpan, colSpan, obj, opts)
  }

  buildRepl() {
    buildRepl.apply(this, arguments)
  }

  // set grid items
  print(data) {
    // add line graph
    graph(this.grid, data, 'time series', 0, 0, 10, 10)
    // add vol graph
    graph(
      this.grid,
      { x: data.x, y: data.vol, style: { line: [90, 140, 250] } },
      'volume',
      10,
      0,
      3,
      10,
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

    // set valid keys
    this.screen.key(['enter', 'escape', 'q', 'C-c'], function (ch, key) {
      const quitters = ['C-c', 'q']
      if (quitters.includes(key.name)) {
        console.log(key)
        process.exit(0)
      }
    })
    // this.screen.key(["f"], function (ch, key) {
    //   line.focus();
    // });

    this.screen.render()
  }
}
