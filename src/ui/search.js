import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import fuzzysort from 'fuzzysort'

const __dirname = import.meta.url

let symbolFile = fs.readFileSync(
  path.resolve(fileURLToPath(__dirname), '../../util/sym-name.json'),
  'utf8',
)
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
