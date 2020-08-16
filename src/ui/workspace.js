import contrib from 'blessed-contrib'

import { parseTime } from './evaluate.js'
import { update } from './update.js'

/*
 * blessed-contrib grid controller
 * */
export class Workspace {
  constructor(screen, options) {
    this.screen = screen
    this.options = options
    // incrementing unique id for components
    this.id = (function () {
      const incId = function () {
        return _id++
      }
      return incId
    })()
    this.prevFocus
    this.repl = { focus: () => {} }
  }

  setListeners(ws, box) {
    ws.screen.focusPush(box)
    if (box.name != 'input') {
      box.key('>', () => {
        ws.repl.focus()
      })
    }

    ws.prevFocus = box
    box.on('focus', () => {
      box.setFront()
      ws.screen.render()
    })

    box.on('blur', () => {
      ws.prevFocus.style.border = { fg: '#00f' }
      ws.prevFocus = box
      box.style.border = { fg: '#0f0' }
      screen.render()
    })
  }

  /** called by Carousel.workspaces once per Carousel "page", or "workspace",
   * as this package defines them. Exists to pass screen to each grid.
   *
   * each workspace defined in config instantiates a new grid, that
   * is called on switch screens.
   * TODO: handle switch workspace input
   * */
  init(screen) {
    const ws = screen._ws
    ws.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen,
    })

    ws.options.components.forEach((componentOptions) => {
      // set id
      componentOptions.id = ws.id()
      // handle options
      componentOptions.time &&
        parseTime(ws, componentOptions, [':' + componentOptions.time])

      update(ws, componentOptions, true)
    })
  }
}
