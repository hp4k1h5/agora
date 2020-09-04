// alpha is a very basic mean-reversion trading algorithm. it will determine a
// valid trading range, and execute buy/sell orders when the stock is within
// that range. This bot has not been backtested or tested at all, and is
// probably not a suitable investment vehicle for you. It is meant as a
// demonstration and learning tool for users who wish to create their own
// trading algorithms.
export async function alpha(ws, options) {
  ws.printLines('{#afa-fg}alpha{/} bot, go')

  // get stocks daily bars

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
