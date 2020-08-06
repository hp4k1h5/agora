import contrib from 'blessed-contrib'

import { parseTime } from './repl.js'
import { update } from './update.js'

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
      // handle options
      c.time && parseTime(ws, c, c.time)
      update(ws, c)
    })
  }
}
