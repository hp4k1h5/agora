// import fs from 'fs'
import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { config } from './util/config.js'
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
      config.workspaces.map((options) => {
        const _ws = new Workspace(screen, options)
        screen._ws = _ws
        return _ws.init(screen)
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

    async initData(ui) {
      // TODO: create spinner
      // fetch initial data
      // const data = await getPrices(ui).catch(console.log)
      // const quote = await getQuote(ui.sym)
      // add elements to home screen
      // ui.buildQuote(quote)
      // ui.buildCharts(data)
      // ui.buildRepl(6, 9, 6, 3)
    },
  }

  return self
} // TODO: add sym from config

const app = main()
app.startCarousel(
  app.uis.map((ui) => ui.init),
  app.carouselOptions,
)
