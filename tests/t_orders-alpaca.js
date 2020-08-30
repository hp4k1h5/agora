import { getOrders } from '../src/api/alpaca.js'
;(async function t_getOrders() {
  const data = await getOrders({ id: 0, wsId: 0, q: {} })

  console.log(data)
})

import { shapeOrders } from '../src/shape/shapeAlpaca.js'
import { orders_alpaca } from '../data/orders_alpaca.js'

const shaped = shapeOrders(orders_alpaca)
console.log(shaped)
