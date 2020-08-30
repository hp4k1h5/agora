import { ordersData } from '../data/orders_alpaca.js'

import { shapeAccountAlpaca } from '../src/shape/shapeAlpaca.js'
// import { accountAlpacaPortfolio } from '../data/account_alpaca-portfolio.js'

console.log(ordersData)

const result = shapeAccountAlpaca(ordersData)
console.log(result)
