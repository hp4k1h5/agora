const messages = {}

export function shapeBots(data) {
  const up = data.pl >= 0
  messages[data.bot] = `  {bold}${data.bot}{/}
  {yellow-fg}${data.symbol?.toUpperCase()}{/}
pl: {#${up ? '4fb' : 'a25'}-fg} ${data.pl?.toFixed(2)}  ${data.percent?.toFixed(
    2,
  )}{/}% | qty: ${data.qty?.toLocaleString()}
${data.msg}`

  return Object.values(messages).join(
    '\n{bold}{#bbb-fg}=================={/}\n',
  )
}
