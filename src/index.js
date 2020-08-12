import blessed from 'blessed'
import contrib from 'blessed-contrib'

// CONFIG
import { config } from './util/config.js'

import { Workspace } from './ui/workspace.js'

/**
 * main
 * */
export const main = function () {
  const screen = blessed.screen({ smartCSR: true, log: 'log.txt' })

  const self = {
    config,

    screen: (function () {
      screen.key('C-c', function () {
        this.destroy()
        process.exit(0)
      })
      return screen
    })(),

    workspaces: (function () {
      return config.workspaces.map((options) => {
        /** attach workspace to screen object to pass it through to
         * contrib.carousel callback */
        screen._ws = new Workspace(screen, options)
        /** init is a callback function called by carousel(screens)
         * on each screen */
        return screen._ws
      })
    })(),

    carouselOptions: {
      screen,
      interval: 3000,
      controlKeys: false,
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
