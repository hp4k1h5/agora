import { colorVal } from '../../shape/shapers.js'

// this function calculates a range of data related to account activities
export function shapeActivities(activityData) {
  // risk is the total amount of dollars put at risk over a set of FILLs
  let risk = 0
  // pl is the profit or loss on the completed trades over a set of FILLs
  let pl = 0
  // positive completed trades
  let winners = 0

  // a map of symbols invested in over a set of FILLs
  let instruments = {}
  // a list of individual completed trades
  const trades = []

  // loop over each FILL and calculate pl
  activityData.forEach((act) => {
    const sign = act.side == 'buy' ? 1 : -1
    let val = act.price * act.qty

    // instantiate new instrument
    if (!instruments[act.symbol]) {
      risk += val

      instruments[act.symbol] = {
        last: act,
        side: act.side,
        tot_qty: act.qty * sign,
        risk: val,
        pps: val / act.qty,
        pl: 0,
      }
      return
    }

    // existing instrument

    // growing the position
    if (
      (instruments[act.symbol].tot_qty >= 0 && act.side == 'buy') ||
      (instruments[act.symbol].tot_qty <= 0 && act.side != 'buy')
    ) {
      // add to total risk pool
      risk += val
      // calc
      instruments[act.symbol].tot_qty += act.qty * sign
      instruments[act.symbol].risk += val

      // calculate price per share of risk pool
      instruments[act.symbol].pps =
        instruments[act.symbol].risk / Math.abs(instruments[act.symbol].tot_qty)

      return
    }

    // shrinking the position
    // risk -= val

    // calculate profit/loss on the trade
    let _pl
    // calc long exit
    if (instruments[act.symbol].tot_qty >= 0) {
      _pl = val - act.qty * instruments[act.symbol].pps
    } else {
      // calc short exit
      _pl = act.qty * instruments[act.symbol].pps - val
    }

    // calc globals
    if (_pl > 0) winners++
    pl += _pl

    // risk off
    instruments[act.symbol].tot_qty += act.qty * sign
    instruments[act.symbol].risk -= val

    instruments[act.symbol].pl += _pl

    trades.push({
      symbol: act.symbol,
      pps_in: instruments[act.symbol].pps,
      pps_out: act.price,
      qty: act.qty,
      pl: _pl,
    })
  })

  const cumulative = [
    {
      pl: pl.toFixed(3),
      trades: activityData.length,
      compl: trades.length,
      'risk/trade': (risk / trades.length).toFixed(3),
      'pl/risk %': ((pl / (risk / trades.length)) * 100).toFixed(3),
      'win %': ((winners / trades.length) * 100).toFixed(2),
    },
  ]

  const shapeAgain = (arr) => {
    return arr
      .map((o) =>
        Object.entries(o)
          .map((e) => `{#4ae-fg}${e[0]}{/}: ${colorVal(e[1])}`)
          .join('\n'),
      )
      .join('\n=============\n')
  }

  instruments = Object.values(instruments).map((i) => {
    i.symbol = i.last.symbol
    delete i.last
    return i
  })

  return {
    trades: shapeAgain(trades.reverse()),
    instruments: shapeAgain(instruments),
    cumulative: shapeAgain(cumulative),
  }
}
