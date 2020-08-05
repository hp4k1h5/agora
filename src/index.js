import fs from 'fs'

import blessed from 'blessed'
import contrib from 'blessed-contrib'

let _config = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(_config)

import { Workspace } from './ui/workspace.js'

/**
 * main
 * */
const main = function () {
  const screen = blessed.screen({ smartCSR: true })

  const self = {
    config,

    screen: (function () {
      screen.key('C-c', function () {
        this.destroy()
        console.log('exiting iexcli...')
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
