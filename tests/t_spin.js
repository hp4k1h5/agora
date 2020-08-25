import { spin } from '../src/util/spin.js'

let i = 0
const me = setInterval(() => {
  if (i++ > 100) clearInterval(me)
  console.clear()
  console.log(spin())
}, 700)
