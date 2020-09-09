// import your bots from anywhere
import { alpha } from './docs/bots/alpha.js'

// include them in the exports here
export default {
  alpha,
  beta,
  // reuse bots for different stocks  by giving them a different key name
  gamma: beta,
  alpha2: alpha,
}

// you can also create functions in this file and export them above. see
// example below, and the examples in `docs/bots/`. For more information see
// docs/bots/README.md.

// not a real trading bot, just shows print
async function beta(ws, options) {
  ws.printLines('{bold}{blue-fg}beta{/} bot, go')

  // instantiate an interval and return it. from the repl you can stop and
  // start this bot with `bots start beta` or `bots stop beta`

  const up = Math.floor(Math.random() * 2) ? -1 : 1
  const pFunc = () => {
    ws.printLines('{bold}{blue-fg}beta{/} bot, print')
    options.print({
      bot: 'beta',
      symbol: options.symbol || 'demo',
      pl: up * Math.random() * 10000,
      percent: up * Math.random() * 100,
      qty: Math.floor(Math.random() * 1e6),
      msg: `{green-fg}order filled{/} + ${Math.floor(Math.random() * 10000)}
  ! {red-fg}low volume!{/}`,
    })
  }

  // call first in case the interval is long
  pFunc()
  // set interval and return it
  const interval = setInterval(
    pFunc,
    // 2 seconds
    2000,
  )

  // in order for iexcli to be able to start and stop your bot, you must return
  // the interval it runs with
  return interval
}
