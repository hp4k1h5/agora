import fs from 'fs'
import blessed from 'blessed'

import { UI } from './src/print.js'
import { getPrices, getQuote } from './src/api.js'

/*
 * main fn calls builds screen and inits app
 * */
;(async function (sym = 'cat') {
  // create screen
  const screen = blessed.screen({ smartCSR: true })
  screen.key('C-c', function () {
    this.destroy()
    console.log('exiting iexcli...')
  })
  const curScreen = new UI(0, 'default', screen, sym)

  // TODO: create spinner
  // fetch initial data
  const data = await getPrices(curScreen)
  const quote = await getQuote(curScreen.sym)

  // add elements to screen
  curScreen.buildQuote(quote)
  curScreen.buildCharts(data)
  curScreen.buildRepl(6, 9, 6, 3)
})() // TODO: add sym from config
