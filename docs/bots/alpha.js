export async function alpha(ws, options) {
  ws.printLines('{#afa-fg}alpha{/} bot, go')

  const interval = setInterval(
    () =>
      options.print({
        bot: 'alpha',
        symbol: 'STOCK',
        pl: (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random() * 10000,
        qty: Math.floor(Math.random() * 1e6),
        msg: `{green-fg}order filled{/} + ${Math.floor(Math.random() * 10000)}
  {green-fg}no asks{/}`,
      }),
    // 15 seconds
    15000,
  )

  return interval
}
