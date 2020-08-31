import blessed from '@hp4k1h5/blessed'
import contrib from '@hp4k1h5/blessed-contrib'

import { config } from './util/config.js'
import { Workspace } from './ui/workspace.js'
import { initComponent } from './util/parse.js'
import { update } from './ui/update.js'

function buildScreen() {
  const screen = blessed.screen({
    title: 'iexcli',
    smartCSR: true,
    // log: 'data/log.txt',
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

  return screen
}
const screen = buildScreen()

export const main = function () {
  // build workspaces to send to carousel
  const workspaces = config.workspaces.map((wsOptions, i) => {
    return async function () {
      wsOptions.screen = screen
      wsOptions.id = i

      const ws = new Workspace(wsOptions)
      await Promise.all(
        ws.options.components.map(async (cOptions) => {
          initComponent(ws, cOptions)

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
    rotate: true,
  }
  function startCarousel(pages, options) {
    const carousel = new contrib.carousel(pages, options)
    carousel.start()
    return carousel
  }
  return startCarousel(workspaces, carouselOptions)
}
export const carousel = main()
