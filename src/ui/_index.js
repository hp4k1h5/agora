import blessed from 'blessed'
import contrib from 'blessed-contrib'

import { config } from '../util/config.js'

const screen = blessed.screen({
  title: 'iexcli',
  smartCSR: true,
  debug: 'log.txt',
})

const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen,
})
