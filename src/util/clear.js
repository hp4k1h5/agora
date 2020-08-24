export function clear(ws, options) {
  if (options.box) {
    ws.options.screen.remove(options.box)
  }

  // TODO: edit blessed-contrib to remove borders and attach graphs to a single
  // box component
  if (options.volChart) {
    ws.options.screen.remove(options.volChart)
  }

  if (options.interval) {
    clearInterval(options.interval)
  }
}
