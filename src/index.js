import fs from 'fs'

import blessed from 'blessed'
import contrib from 'blessed-contrib'

let _config = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(_config)

import { Workspace } from './ui/print.js'
import { getPrices, getQuote } from './api/api.js'

/**
 * main
 * */
const main = function (sym = 'cat') {
  const screen = blessed.screen({ smartCSR: true })

  const self = {
    config,

    screen: (function () {
      screen.key('C-c', function () {
        this.destroy()
        console.log('exiting iexcli...')
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
      controlKeys: true,
    },

    startCarousel(pages, carouselOptions) {
      const carousel = new contrib.carousel(pages, carouselOptions)
      carousel.start()
      return carousel
    },

    async initData(ws) {
      // TODO: create spinner

      // fetch initial data
      for (let c = 0; c < ws.options.components.length; c++) {
        const component = ws.options.components[c]
        if (component.type == 'line') {
          const data = await getPrices(ws, component).catch((e) => {})

          // add elements to home screen
          ws.buildPriceVolCharts(ws, component, data)
        }
      }
    },
  }

  return self
} // TODO: add sym from config

const app = main()
app.startCarousel(
  app.workspaces.map((ws) => ws.init),
  app.carouselOptions,
)
app.initData(app.workspaces[0])
