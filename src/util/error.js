export function handleErr(ws, e) {
  ws.printLines(
    `{red-fg}err:{/} 
    status:   {#fa7-fg}${e.status}{/}
    message:  {#faa-fg}${e.statusText}{/}`,
  )
}
