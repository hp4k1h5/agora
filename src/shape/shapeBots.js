const messages = {}

export function shapeBots(data) {
  if (data) {
    const up = data.pl >= 0
    messages[data.bot + ' ' + data.symbol] = `  {bold}${data.bot}{/}
  {yellow-fg}${data.symbol?.toUpperCase()}{/} ${data.side?.toUpperCase()}
pl: {#${up ? '4fb' : 'a25'}-fg} ${data.pl?.toFixed(2)}  ${data.plpc?.toFixed(
      2,
    )}{/}% | qty: ${data.qty?.toLocaleString()}
${data.msg}`
  }

  return Object.values(messages).join(
    '\n{bold}{#bbb-fg}=================={/}\n',
  )
}
