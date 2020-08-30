import robots from '../../bots.js'
// import { setTargets } from '../util/parse.js'

export async function bots(ws, words) {
  // bots list
  ws.printLines(Object.keys(robots))

  return
  // const targets = setTargets(ws, words, command)
  // if (!targets.length) return
  // targets.forEach((target) => {
  //   setComponentOptions(ws, target, words, command)

  //   setSymbol(target, words)
  //   setTime(ws, target, words)
  // })

  //
  ws.printLines(targets[0]?.name)
}
