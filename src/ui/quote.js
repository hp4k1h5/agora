import blessed from 'blessed'
// import contrib from 'blessed-contrib'

/** if no symbol is provided, it should stay in sync with a chart */
export function buildQuoteList(ws, options, data) {
  if (!options.box || options.type != 'quote') {
    options.box = ws.grid.set(...options.yxhw, blessed.text, {
      name: 'quote',
      label: `${options.id} quote`,
      // columnSpacing: 3,
      // columnWidth: [13, 30],
      keys: false,
      input: true,
      // interactive: false,
      tags: true,
      style: {
        focus: { border: { fg: '#ddf' } },
      },
    })
    // add focus listeners
    ws.setListeners(options)
  }

  // set data
  if (!data) return
  options.box.setContent(data.join('\n'))
  // options.box.setData({ headers: data[0], data: data.slice(1) })
}
