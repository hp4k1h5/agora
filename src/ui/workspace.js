import contrib from '@hp4k1h5/blessed-contrib'
import { carousel } from '../index.js'

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

    // carousel listeners
    screen.on('move', () => {
      clearInterval(options.interval)
      delete options.interval
      delete options.pollMs
    })

    // TODO cant have nice things. i have to find a way to prevent the repl
    // from getting double focused when components refresh. Im not doing much
    // to control repl input focus since the component seems to want to manage
    // that itself, and any setting other than `inputFocusTrue` has not worked
    // for me. The bug is inconsistent and persistent.
    //
    // if (!this.prevFocus) this.prevFocus = options

    // options.box.on('focus', () => {
    //   options.box.setFront()
    //   if (!options.pollMs) options.box.style.border = { fg: '#fc5' }
    // })

    // options.box.on('blur', () => {
    //   if (this.input.focused) {
    //     this.prevFocus.box.style.border = { fg: '#6ff' }
    //     options.box.style.border = { fg: '#fc5' }
    //   } else if (!options.pollMs) {
    //     this.prevFocus.box.style.border = { fg: '#6ff' }
    //   }
    //   this.prevFocus = options
    //   screen.render()
    // })

    // TODO leave in blur once repl focus is stable
    this.prevFocus = options

    options.box.on('destroy', () => {
      clearInterval(options.interval)
      delete options.interval
      delete options.pollMs
    })

    // TODO fix
    // if (!options.interval) {
    //  screen.focusPush(options.box)
    // }
  }
}
