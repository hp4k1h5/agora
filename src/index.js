import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { config } from './util/config.js'
import { Workspace } from './ui/workspace.js'

/**
 * main
 * */
export const main = function () {
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

  const self = {
    workspaces: (function () {
      return config.workspaces.map((options) => {
        /** attach workspace to screen object to pass it through to
         * contrib.carousel callback */
        screen._ws = new Workspace(screen, options)
        return screen._ws
      })
    })(),

    carouselOptions: {
      screen,
      interval: 0,
      controlKeys: true,
    },

    startCarousel(pages, carouselOptions) {
      const carousel = new contrib.carousel(pages, carouselOptions)
      carousel.start()
      return carousel
    },
  }

  return self
}

const app = main()
app.startCarousel(
  app.workspaces.map((ws) => ws.init),
  app.carouselOptions,
)
