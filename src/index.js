import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { config } from './util/config.js'
import { Workspace } from './ui/workspace.js'
import { update } from './ui/update.js'

const main = function () {
  const screen = blessed.screen({ title: 'iexcli', smartCSR: true })
  // set app-wide screen keys
  // app-wide exit
  screen.key('C-c', function () {
    this.destroy()
    process.exit(0)
  })
  // tab through components
  screen.key(['tab'], function () {
    screen.focusNext()
  })
  screen.key(['S-tab'], function () {
    screen.focusPrevious()
  })

  // build workspaces to send to carousel
  const workspaces = config.workspaces.map((wsOptions) => {
    return function () {
      wsOptions.screen = screen
      const ws = new Workspace(wsOptions)
      const components = ws.options.components.map(async (cOptions) => {
        await update(ws, cOptions)
      })
      return components
    }
  })

  // init carousel
  const carouselOptions = {
    screen,
    interval: 0,
    controlKeys: true,
  }
  function startCarousel(pages, options) {
    const carousel = new contrib.carousel(pages, options)
    carousel.start()
  }
  startCarousel([...workspaces], carouselOptions)
}

main()
