import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { config } from './util/config.js'
import { Workspace } from './ui/workspace.js'
import { update } from './ui/update.js'
import { setTime } from './ui/evaluate.js'

const screen = blessed.screen({
  title: 'iexcli',
  smartCSR: true,
})
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

const main = function () {
  // build workspaces to send to carousel
  const workspaces = config.workspaces.map((wsOptions) => {
    return async function () {
      wsOptions.screen = screen

      const ws = new Workspace(wsOptions)
      await Promise.all(
        ws.options.components.map(async (cOptions) => {
          cOptions.id = ws.id()
          setTime(cOptions, [`:${cOptions.time}`], ws)
          await update(ws, cOptions)
        }),
      )
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
