//// beta is not a real trading bot, but an example demo of how to use iexcli
// with your bots. See docs/bots/README.md for more information.
export async function alpha(ws, options) {
  ws.printLines('{#afa-fg}alpha{/} bot, go')

  const up = Math.floor(Math.random() * 2) ? -1 : 1
  const pFunc = () =>
    options.print({
      bot: 'alpha',
      symbol: options.symbol || 'SYM',
      pl: up * Math.random() * 10000,
      percent: up * Math.random() * 30,
      qty: Math.floor(Math.random() * 1e6),
      msg: `{green-fg}order filled{/} + ${Math.floor(Math.random() * 10000)}
  {green-fg}heavy asks{/}`,
    })

  // call pFunc once to start in case the interval is long
  pFunc()
  // set interval
  const interval = setInterval(
    // wrapper function
    pFunc,
    // 15 seconds
    15000,
  )

  // return interval back to iexcli
  return interval
}
