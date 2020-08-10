export function handleErr(ws, e) {
  if (!e.status || !e.statusText)
    return ws.printLines('{red-fg}internal err:{/} ' + e.toString())

  ws.printLines(
    `{red-fg}err:{/} 
    status:   {#fa7-fg}${e.status}{/}
    message:  {#faa-fg}${e.statusText}{/}`,
  )
}
