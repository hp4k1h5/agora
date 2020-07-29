import blessed from 'neo-blessed'

import { graph } from './graph.js'

/*
 * neo-blessed contrib grid controller
 * */
export class UI {
  constructor(id, name, screen) {
    this.id = id
    this.name = name
    this.screen = screen
    // e.g. grid.set(row, col, rowSpan, colSpan, obj, opts)
  }

  buildRepl() {
    const inputLine = blessed.textarea({
      inputOnFocus: true,
      top: '50%',
      left: 0,
      width: '50%',
      height: '6%',
      style: {
        fg: 'white',
        bg: 'black',
      },
    })
    this.screen.append(inputLine)

    this.screen.key(['enter'], function (ch, key) {
      inputLine.sumbit()
    })

    inputLine.on('submit', () => console.log('subutut'))

    inputLine.focus()
    this.screen.render()
  }

  buildForm() {
    const screen = this.screen
    var form = blessed.form({
      parent: screen,
      keys: true,
      left: 0,
      top: 0,
      width: 60,
      height: 10,
      padding: 0,
      margin: 0,
    })

    const console = blessed.textarea({
      parent: form,
      top: 0,
      left: 0,
      width: form.width - 2,
      height: 5,
      content: `Welcome to iexcli
      type h for help`,
      // border: { type: 'line' },
    })

    const repl = blessed.textbox({
      parent: form,
      name: 'repl',
      top: 6,
      left: 0,
      width: form.width,
      height: 3,
      inputOnFocus: true,
      border: { type: 'line' },
      focus: {
        border: { fg: 'blue' },
      },
    })

    repl.key('enter', function () {
      form.submit()
      repl.focus()
    })

    form.on('submit', function (data) {
      console.setContent(JSON.stringify(data, null, 2))
      screen.render()
    })

    repl.focus()
    screen.render()
  }

  buildBox() {
    const box = blessed.box({
      top: 0,
      left: 0,
      width: '50%',
      height: '50%',
      content: 'CONTENT',
      tags: true,
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        bg: 'blue',
        border: {
          fg: '#f0f0f0',
        },
        focus: {
          fg: '#00f0f0',
        },
      },
    })

    this.screen.append(box)

    // If our box is clicked, change the content.
    box.on('click', function (data) {
      box.setContent(`{center}{red-fg}CONTENT{/red-fg}.{/center}`)
      this.screen.render()
    })

    // If box is focused, handle `enter`/`return` and give us some more content.
    box.key('enter', function (ch, key) {
      box.setContent(
        '{right}Even different {black-fg}content{/black-fg}.{/right}\n',
      )
      box.setLine(1, 'bar')
      box.insertLine(1, 'foo')
      this.screen.render()
    })

    // quit on escape, q, or Ctrl-c
    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
      return process.exit(0)
    })

    this.screen.render()
  }

  // set grid items
  print(data) {
    // add line graph
    graph(this.grid, data, 'time series', 0, 0, 10, 10)
    // add vol graph
    graph(
      this.grid,
      { x: data.x, y: data.vol, style: { line: [90, 140, 250] } },
      'volume',
      10,
      0,
      3,
      10,
    )

    // add stock list
    // table(
    //   this.grid,
    //   {
    //     headers: ['stonks'],
    //     data: [
    //       ['msft'],
    //       ['google'],
    //       ['tsla'],
    //       ['amzn'],
    //       ['aapl'],
    //       ['goog'],
    //       ['spy'],
    //       ['qqq'],
    //     ],
    //   },
    //   0,
    //   10,
    //   12,
    //   2,
    // )

    // set valid keys
    this.screen.key(['enter', 'escape', 'q', 'C-c'], function (ch, key) {
      const quitters = ['C-c', 'q']
      if (quitters.includes(key.name)) {
        console.log(key)
        process.exit(0)
      }
    })
    // this.screen.key(["f"], function (ch, key) {
    //   line.focus();
    // });

    this.screen.render()
  }
}
