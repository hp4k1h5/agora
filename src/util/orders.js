import { handleErr } from './error.js'
import {
  submitOrder,
  submitClose,
  submitCloseAll,
  submitCancelAll,
  submitCancel,
} from '../api/alpaca.js'
import { setSymbol, setTime } from './parse.js'

export async function setOrder(ws, options, words) {
  // execute orders first cannot be combined with other commands
  const orderCmd = words.find((w) => /^[+-][\d,_]+$/.test(w))
  const closeCmd = words.find((w) => w == 'close')
  const cancelCmd = words.find((w) => w == 'cancel')
  if (!orderCmd && !closeCmd && !cancelCmd) {
    return false
  } else if (!!orderCmd + !!closeCmd + !!cancelCmd > 1) {
    handleErr(ws, 'cannot submit more than one of +/-, close, cancel')
    return
  }

  let order = { time: options.time || '1d' }

  setSymbol(order, words)
  if (!order.symbol && orderCmd) {
    handleErr(ws, 'orders must have stock symbol, e.g. {yellow-fg}$sym{/}')
    return
  }
  order.symbol = order.symbol?.toUpperCase()

  if (closeCmd) {
    if (words.find((w) => w == 'all')) {
      ws.printLines(`{bold}{#fd8-fg}closing all positions...{/}`)
      try {
        await submitCloseAll(ws, options)
      } catch (e) {
        handleErr(ws, e)
      }
    } else if (order.symbol) {
      try {
        await submitClose(ws, options, order.symbol)
      } catch (e) {
        handleErr(ws, e)
      }
    }
    return true
  } else if (cancelCmd) {
    if (words.find((w) => w == 'all')) {
      ws.printLines('{bold}{#fd8-fg}canceling all orders...{/}')
      try {
        await submitCancelAll(ws, options)
      } catch (e) {
        handleErr(ws, e)
      }
    } else if (order.symbol) {
      try {
        await submitCancel(ws, options, order.symbol)
      } catch (e) {
        handleErr(ws, e)
      }
    } else {
      const orderIds = words.filter((w) => w !== 'cancel')
      if (!orderIds.length) return

      try {
        await submitCancel(ws, options, null, orderIds)
      } catch (e) {
        handleErr(ws, e)
      }
    }
    return true
  }

  order.qty = +orderCmd.replace(/[,\-+_]/g, '')
  if (isNaN(order.qty)) {
    handleErr(ws, `not a valid lot size ${order.qty}`)
    return true
  }
  order.side = orderCmd[0] == '+' ? 'buy' : 'sell'

  order.type =
    words.find((w) => ['market', 'limit', 'stop', 'stop_limit'].includes(w)) ||
    'market'

  order.limit_price = words.find((w) => /^<[\d.]+$/.test(w))
  order.stop_price = words.find((w) => /^>[\d.]+$/.test(w))

  if (order.type == 'stop_limit' && !(order.limit_price && order.stop_price)) {
    handleErr(
      ws,
      'stop_limit order must include limit_price and stop_price, e.g. {#eb5-fg}<{yellow-fg}3.16{/} {#eb5-fg}>{yellow-fg}3.26 {/}',
    )
    return true
  } else if (order.limit_price && order.stop_price) {
    order.type = 'stop_limit'
    order.limit_price = +order.limit_price.replace(/[,\-+_<]/g, '')
    order.stop_price = +order.stop_price.replace(/[,\-+_>]/g, '')
  } else if (order.type == 'limit' && !order.limit_price) {
    handleErr(
      ws,
      'limit order must include limit_price, e.g. {#eb5-fg}<{yellow-fg}3.16{/}',
    )
    return true
  } else if (order.limit_price) {
    order.type = 'limit'
    order.limit_price = +order.limit_price.replace(/[,\-+_<]/g, '')
  } else if (order.type == 'stop' && !order.stop_price) {
    handleErr(
      ws,
      'stop order must include stop_price, e.g. {#eb5-fg}>{yellow-fg}3.16{/}',
    )
    return true
  } else if (order.stop_price) {
    order.type = 'stop'
    order.stop_price = +order.stop_price.replace(/[,\-+_>]/g, '')
  }

  order.time_in_force =
    words.find((w) => ['day', 'gtc', 'opg', 'cls', 'ioc', 'fok'].includes(w)) ||
    'day'

  try {
    await submitOrder(ws, options, order)
  } catch (e) {
    handleErr(ws, e)
  }
  return true
}
