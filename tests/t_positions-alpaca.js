import { getPositions } from '../src/api/alpaca.js'
;(async function () {
  const data = await getPositions({ q: {}, id: 0, wsId: 0 })
  console.log(data)
})

import { positionsData } from '../data/positions_alpaca.js'
import { shapePositions } from '../src/shape/shapeAlpaca.js'
const shaped = shapePositions(positionsData)
console.log(shaped)
