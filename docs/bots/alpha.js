import { getPrices, getBook, getQuote } from '../../src/api/iex.js'
import { getPosition, submitClose, submitOrder } from '../../src/api/alpaca.js'

// alpha is a very basic mean-reversion trading algorithm. it will determine a
// valid trading ranges, and execute buy/sell orders when the stock is within
// those ranges. This bot has not been backtested or tested at all, and is
// probably not a suitable investment vehicle for you. It is meant as a
// demonstration and learning tool for users who wish to create their own
// trading algorithms.
//
// This bot is intended to be started and stopped from an iexcli repl, and does
// not do any checks to ensure the market is open and trading.
export async function alpha(ws, options) {
  if (!options.symbol) {
    ws.printLines(
      '{#fa1-fg}alpha{/} bot needs a symbol, provide one with $symbol',
    )
    return
  }

  // set up the print object
  const botOptions = {
    bot: 'alpha ' + options.symbol,
    symbol: options.symbol,
    side: '',
    pl: 0,
    plpc: 0,
    qty: 0,
    msg: '',
  }

  ws.printLines('{#afa-fg}alpha{/} bot, go')

  // this bot only trades one lot of shares at a time. if it is invested it
  // will try to exit the position once it has gained or lost 1%.
  let position
  async function meanReversion() {
    // first check whether or not bot is invested in the stock
    ws.printLines(`{#afa-fg}alpha{/} bot, checking ${options.symbol} position`)

    try {
      position = await getPosition(options)
    } catch (e) {
      ws.printLines(`{#afa-fg}alpha{/} bot, no ${options.symbol} position`)
    }

    if (position) {
      // if the bot is up or down more than a percent in profit, close the position
      if (Math.abs(position.unrealized_intraday_plpc) > 0.002) {
        ws.printLines(
          `{#afa-fg}alpha{/} bot, pl% ${position.unrealized_intraday_plpc}. closing position`,
        )
        try {
          await submitClose(ws, options, position.symbol)
          ws.printLines(
            `{#afa-fg}alpha{/} bot, closed ${options.symbol} position`,
          )
          position = null
          return
        } catch (e) {
          ws.printLines(
            `{#afa-fg}alpha{/} bot, {red-fg}ERR{/} could not close ${options.symbol} position`,
          )
        }
      }

      // else print bot info and return
      botOptions.side = position.side
      botOptions.pl = +position.unrealized_intraday_pl
      botOptions.plpc = +position.unrealized_intraday_plpc * 100
      botOptions.qty = +position.qty
      options.print(botOptions)

      return
    }

    // otherwise if the bot is not invested, it will query market data and look
    // for opportunities to invest when the stock price has deviated more than
    // 1% from the daily mean

    // get stocks daily bars
    ws.printLines(
      `{#afa-fg}alpha{/} bot, getting ${options.time} price/vol data for ${options.symbol}`,
    )
    let data
    try {
      data = await getPrices(options)
    } catch (e) {
      ws.printLines(e)
      return
    }

    // accumulate stock data
    let { prices, avg, tot, hi, lo, vol } = data.reduce(
      (a, v) => {
        // strip nulls
        if (!v.close) return a

        a.prices.push(v)
        a.tot++
        a.avg += v.close
        a.vol += v.volume
        if (v.close > a.hi) a.hi = v.close
        if (v.close < a.lo) a.lo = v.close
        return a
      },
      { prices: [], avg: 0, tot: 0, hi: -Infinity, lo: Infinity, vol: 0 },
    )

    // get realtime quote for last trade info
    let quote
    try {
      quote = await getQuote(options)
    } catch (e) {
      ws.printLines(e)
      return
    }
    const last = quote.latestPrice

    // find average
    avg = avg / tot
    // find mean
    let mean = [...prices].sort((l, r) => {
      return l.close - r.close
    })
    mean = mean[Math.floor(mean.length / 2)].close

    // calculate percentage delta from mean
    const meanDiff = last - mean
    const meanDiffPer = meanDiff / mean

    // calc some other data for display
    const hiLoDiff = hi - lo
    const hiLoPer = ((hiLoDiff / last) * 100).toFixed(2)

    // build msg
    botOptions.msg = `over ${options.time}: avg: ${avg.toFixed(
      2,
    )} last: {#cf9-fg}${last}{/} 
{bold}mean: ${mean} | {#cff-fg}${(meanDiffPer * 100).toFixed(2)}{/}%
hi: {#afa-fg}${hi}{/} - lo: {#faa-fg}${lo}{/} = ${hiLoDiff.toFixed(
      2,
    )} ~${hiLoPer}% 
vol: ${vol.toLocaleString()}`

    ws.printLines(
      `${options.symbol} @ ${last} off ${(meanDiffPer * 100).toFixed(
        2,
      )}% from day mean`,
    )

    // this is where the bot decides what to do. given that this is a mean
    // reversion "algorithm", it will decide at what threshold to buy/sell to
    // revert back to a mean, and execute accordingly. This bot will always try
    // to revert back to the _daily_ mean, regardless of time of day.  Simple
    // tweaks to this algorithm would include shortening/lengthening the number
    // of minutes of data the bot is looking at, and widening or narrowing its
    // trading range.
    //
    // This example shows a 1% mean reversion algorithm, which will execute in
    // the opposite direction of the deviation when a stock is 1% above or
    // below its _daily_ mean. It's exits again when the profit/loss has
    // exceeeded 1%, as defined above at the top of the function.

    if (Math.abs(meanDiffPer) > 0.002) {
      let side = ''
      if (meanDiff > 0) {
        side = 'sell'
      } else {
        side = 'buy'
      }

      // without bringing in book data, it's safest to submit market orders,
      // but a typical bot would probably query book data before executing a
      // trade
      let qty = 1
      let order = {
        symbol: options.symbol.toUpperCase(),
        side,
        qty,
        time_in_force: 'gtc',
        type: 'market',
      }

      ws.printLines(`${side}ing ${qty} shr of ${options.symbol}`)
      await submitOrder(ws, options, order)

      botOptions.msg += JSON.stringify(order, null, 2)
    } else {
      ws.printLines(`${options.symbol} is too close to mean to trade`)
    }

    options.print(botOptions)
  }

  await meanReversion()
  // set interval
  const interval = setInterval(
    // wrapper function
    meanReversion,
    // 15 seconds
    1000,
  )

  // return interval back to iexcli
  return interval
}
