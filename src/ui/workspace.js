import contrib from '@hp4k1h5/blessed-contrib'

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
    try {
      const screen = this.options.screen

      // carousel listeners
      screen.on('move', () => {
        clearInterval(options.interval)
        delete options.interval
        delete options.pollMs
      })

      if (!this.prevFocus) this.prevFocus = options

      options.box.on('focus', () => {
        options.box.setFront()
        options.box.style.border = { fg: '#fc5' }
      })

      options.box.on('blur', () => {
        if (this.input.focused) {
          this.prevFocus.box.style.border = { fg: '#6ff' }
          options.box.style.border = { fg: '#fc5' }
        } else {
          this.prevFocus.box.style.border = { fg: '#6ff' }
        }
        this.prevFocus = options
        screen.render()
      })

      options.box.on('destroy', () => {
        clearInterval(options.interval)
        delete options.interval
        delete options.pollMs
      })

      if (!options.interval || this.prevFocus === options) {
        screen.focusPush(options.box)
      }
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
}
