import blessed from 'blessed'
import contrib from 'blessed-contrib'

const screen = blessed.screen({
  smartCSR: true,
  title: 'iexcli',
  dockBorders: true,
  debug: 'log.txt',
})

const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen,
})

const boxA = grid.set(0, 0, 5, 5, blessed.box, {
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
      border: { fg: '#ffaa00' },
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
      border: { fg: '#ffaa00' },
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
      border: { fg: '#ffaa00' },
    },
  },
})

const graphA = grid.set(9, 0, 3, 3, contrib.line, {
  name: 'graphA',
  label: 'graphA',
  keys: false,
  mouse: false,
  input: true,
  border: { type: 'line' },
  style: {
    focus: {
      border: { fg: '#ffaa00' },
    },
  },
})
graphA.setData({ x: [1, 2, 3], y: [4, 5, 6] })

const input = grid.set(0, 9, 1, 1, blessed.textbox, {
  name: 'input',
  input: true,
  inputOnFocus: true,
  style: {
    border: { fg: '#0f0' },
    focus: {
      border: { fg: '#faa' },
    },
  },
})
input.key('enter', () => {
  input.clearValue()
  input.focus()
})

screen.key('C-c', function () {
  process.exit(0)
})

screen.key(['tab'], function () {
  screen.focusNext()
})
screen.key(['S-tab'], function () {
  screen.focusPrevious()
})

let prevFocus
// const boxes = []
const boxes = [boxA, boxB, boxC, graphA, input]
boxes.forEach((box) => {
  screen.focusPush(box)
  if (box.name != 'input') {
    box.key('>', () => {
      input.focus()
    })
  }

  prevFocus = box
  box.on('focus', () => {
    box.setFront()
    screen.render()
  })

  box.on('blur', () => {
    prevFocus.style.border = { fg: '#00f' }
    prevFocus = box
    box.style.border = { fg: '#0f0' }
    screen.render()
  })
})

const carouselOptions = {
  screen,
  interval: 0,
  controlKeys: false,
}

function startCarousel(pages, carouselOptions) {
  const carousel = new contrib.carousel(pages, carouselOptions)
  carousel.start()
  return carousel
}
