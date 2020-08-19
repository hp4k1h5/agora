export function clear(ws, options) {
  if (options.box) {
    ws.options.screen.remove(options.box)
  }
  if (options.volChart) {
    ws.options.screen.remove(options.volChart)
  }
}
