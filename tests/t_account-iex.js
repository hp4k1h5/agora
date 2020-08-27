// import { shapeAccountIex } from '../src/shape/shapeIex.js'
import { accountAlpacaData } from '../data/account_alpaca.js'

import { shapeAccountAlpaca } from '../src/shape/shapeAlpaca.js'
import { accountAlpacaPortfolio } from '../data/account_alpaca-portfolio.js'

const result = shapeAccountAlpaca(accountAlpacaPortfolio)

console.log(result.portfolio)
