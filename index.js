import blessed from 'neo-blessed'

import { UI } from './src/print.js'
import { getPrices } from './src/api.js'

/*
 * main fn calls builds screen and inits app
 * */
;(async function () {
  const sym = 'tsla'
  // const data = await getPrices(sym, { chartLast: 60 * 6.5 })

  // create screen
  const screen = blessed.screen({ smartCSR: true })
  screen.key('C-c', function () {
    this.destroy()
    console.log('exiting iexcli...')
  })
  const screens = [new UI(0, 'default', screen)]

  const curScreen = screens[0]
  // curScreen.buildBox()
  curScreen.buildRepl()
})()
