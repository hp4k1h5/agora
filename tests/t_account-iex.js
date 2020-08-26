import { shapeAccountIex } from '../src/api/shape.js'

import { accountData } from '../data/account_iex.js'

console.log(accountData)

const result = shapeAccountIex(accountData)

console.log(result)
