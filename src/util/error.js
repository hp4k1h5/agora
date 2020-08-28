export function handleErr(ws, e) {
  // if no repl dump error
  if (!ws.printLines) {
    // TODO set up a logger
    return // console.log(e)
  }

  // non-api errors
  if (!e.status || !e.statusText)
    return ws.printLines(
      '{red-fg}internal err:{/} ' +
        e.toString().replace(/pk.*/, 'iex_public_key'),
    )

  // api errors
  let msg = `{red-fg}err:{/} 
status:   {#fa7-fg}${e.status}{/}
message:  {#faa-fg}${e.statusText}{/}`

  // additional context, helpful for debugging
  if (e._errMeta)
    msg += `
${JSON.stringify(e._errMeta, null, 2)}`

  ws.printLines(msg)
}
