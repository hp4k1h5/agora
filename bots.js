// import your bots from anywhere
import { alpha } from './docs/bots/alpha.js'

// include them in the exports here
export default {
  alpha,
  beta,
  // gamma,
}
// you can also create functions in this file and export them above. see
// example below

// // development
//
// currently all bots' runtimes will be constrained by iexcli's, so it is not
// recommended to use longer term bots with iexcli. Work is in development on a
// socket based interface to allow independent bot runtimes even on servers.
// //

// beta is not a real trading bot, but an example demo of how to use iexcli
// with your bots
//
// bot functions take two parameters: ws and options. There is a print() method
// on the options object you can use to update the bots component if one is
// available. You can also use the ws.printLines() to print to the repl
// output
//
// The options object has the following shape, and should be treated as
// read-only:
// {
//   symbol: 'symbol value',
//   time: 'parsed time value',
//   print: print(info),
// }
//
// print(info) takes one parameter info that has the following shape:
// {
//   bot: 'the name of the bot',
//   symbol: 'the stock your bot is trading',
//   pl: 'profit/loss',
//   qty: 'size of position',
//   msg: 'the message you wish to be displayed in the two lines below the
//   bots' listing. DO NOT include ansi with bot, symbol, pl or position. but
//   you are free to use colors in msg'
async function beta(ws, options) {
  ws.printLines('{bold}{blue-fg}beta{/} bot, go')

  // instantiate an interval and return it. from the repl you can stop and
  // start bots

  const interval = setInterval(
    () =>
      options.print({
        bot: 'beta',
        symbol: 'demo',
        pl: (Math.floor(Math.random() * 2) ? -1 : 1) * Math.random() * 10000,
        qty: Math.floor(Math.random() * 1e6),
        msg: `{green-fg}order filled{/} + ${Math.floor(Math.random() * 10000)}
  ! {red-fg}low volume!{/}`,
      }),
    // 10 seconds
    10000,
  )

  // in order for iexcli to be able to start and stop your bot, you must return
  // the interval it runs under
  return interval
}
