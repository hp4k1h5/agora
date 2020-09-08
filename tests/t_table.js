import { table } from '../src/shape/shapers.js'

const ansiStr = ['{#444-fg}444{/}']
let tabled = table(ansiStr, [5])
console.log(tabled)

const nonAnsiStr = ['123', '456']
tabled = table(nonAnsiStr, [5])
console.log(tabled)
