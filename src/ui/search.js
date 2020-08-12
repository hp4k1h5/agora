import fs from 'fs'

import fuzzysort from 'fuzzysort'

let symbolFile = fs.readFileSync('data/sym-name.json', 'utf8')
symbolFile = JSON.parse(symbolFile)

export function search(what) {
  what = what.replace(/['"()]/g, '')
  const results = fuzzysort.go(what, symbolFile, {
    keys: ['name', 'symbol'],
    limit: 10,
    allowTypo: true,
  })

  return results
}
