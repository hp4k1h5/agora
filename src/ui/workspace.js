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

  setListeners(options) {
    const screen = this.options.screen

    if (!this.prevFocus) this.prevFocus = options

    options.box.on('focus', () => {
      options.box.setFront()
      screen.render()
    })

    options.box.on('blur', () => {
      this.prevFocus.box.style.border = { fg: '#6fa' }
      this.prevFocus = options
      // options.box.style.border = { fg: '#fc5' }
      screen.render()
    })

    screen.focusPush(options.box)
  }
}
