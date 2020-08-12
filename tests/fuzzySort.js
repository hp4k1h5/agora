import fs from 'fs'
import assert from 'assert'

import fuzzysort from 'fuzzysort'

let symbolFile = fs.readFileSync('data/sym-name.json', 'utf8')
symbolFile = JSON.parse(symbolFile)

// test 1
const results = fuzzysort.go('aa', symbolFile, {
  keys: ['name', 'symbol'],
})
assert.equal(results[0].obj.symbol, 'RCKT')

console.log(results[0])
console.log('tests passed')
