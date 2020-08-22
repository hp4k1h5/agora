export function handleErr(ws, e) {
  if (!e.status || !e.statusText)
    return ws.printLines('{red-fg}internal err:{/} ' + e.toString())

  let msg = `{red-fg}err:{/} 
status:   {#fa7-fg}${e.status}{/}
message:  {#faa-fg}${e.statusText}{/}`

  if (e._errMeta)
    msg += `
${JSON.stringify(e._meta, null, 2)}`

  ws.printLines(msg)
}
