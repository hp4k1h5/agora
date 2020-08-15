import blessed from 'blessed'
import contrib from 'blessed-contrib'

const screen = blessed.screen({
  smartCSR: true,
  title: 'iexcli',
  dockBorders: true,
})

const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen,
})

const boxA = grid.set(0, 0, 3, 3, blessed.box, {
  name: 'boxA',
  label: 'boxA',
  keys: false,
  mouse: false,
  tags: true,
  input: true,
  scrollable: false,
  border: { type: 'line' },
  style: {
    focus: {
      border: { fg: '#ff0000' },
    },
  },
})

const boxB = grid.set(3, 3, 3, 3, blessed.box, {
  name: 'boxB',
  label: 'boxB',
  keys: false,
  mouse: false,
  tags: true,
  input: true,
  scrollable: false,
  border: { type: 'line' },
  style: {
    focus: {
      border: { fg: '#ff0000' },
    },
  },
})

const boxC = grid.set(9, 9, 3, 3, blessed.box, {
  name: 'boxC',
  label: 'boxC',
  keys: false,
  mouse: false,
  tags: true,
  input: true,
  scrollable: false,
  border: { type: 'line' },
  style: {
    focus: {
      border: { fg: '#ff0000' },
    },
  },
})
screen.key('C-c', function () {
  process.exit(0)
})

screen.key(['tab'], function () {
  console.log('tab')
  screen.focusNext()
})
;[boxA, boxB, boxC].forEach((box) => screen.focusPush(box))

screen.render()
