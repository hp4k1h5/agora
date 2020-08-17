import contrib from 'blessed-contrib'

/*
 * blessed-contrib grid controller
 * */
export class Workspace {
  constructor(options) {
    this.grid = new contrib.grid({
      screen: options.screen,
      rows: 12,
      cols: 12,
    })
    this.options = options
    // incrementing unique id for components
    this.id = (function () {
      let _id = 0
      const incId = function () {
        return _id++
      }
      return incId
    })()
    this.prevFocus
    this.input = { focus: () => {} }
  }

  setListeners(box) {
    if (!this.prevFocus) this.prevFocus = box
    this.options.screen.focusPush(box)

    if (box.name != 'input') {
      box.key('>', () => {
        this.input.focus()
      })
    }

    box.on('focus', () => {
      box.setFront()
      this.options.screen.render()
    })

    box.on('blur', () => {
      this.prevFocus.style.border = { fg: '#acf' }
      this.prevFocus = box
      box.style.border = { fg: '#fc5' }
      this.options.screen.render()
    })
  }
}
