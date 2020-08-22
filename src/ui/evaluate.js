import { update } from './update.js'
import {
  setOrder,
  setTarget,
  setComponentOptions,
  setTime,
  setSymbol,
} from '../util/parse.js'
import { search as fuzzySearch } from './search.js'
import { help } from './help.js'

export async function evaluate(ws, input) {
  // define command to execute
  const commands = {
    exit,
    quit: exit,
    help,
    h: help,
    '?': search,
    undefined,
    '#': 'chart',
    '!': 'news',
    '=': 'watchlist',
    '&': 'profile',
    '"': 'quote',
    '*': 'list',
    '@': 'account',
  }

  // parse input
  const words = input.split(/\s+/g)

  // handle orders separately
  const order = await setOrder(ws, words)
  if (order) return

  // find ui commands
  const command = commands[words.find((w) => commands[w])]

  // execute repl fns next
  if (typeof command == 'function') return await command(ws, words)

  // parse inputs
  const target = setTarget(ws, words, command)
  if (!target) return
  setComponentOptions(ws, target, words, command)
  setSymbol(target, words)
  setTime(ws, target, words)

  // execute window fns
  await update(ws, target)
}

export function exit(ws) {
  ws.printLines('{#abf-fg}\ngoodbye...{/}')
  setTimeout(() => {
    ws.options.screen.destroy()
    process.exit(0)
  }, 800)
}

function search(ws, words) {
  words = words.filter((w) => w != '?').join(' ')
  let results = fuzzySearch(words)
  results = results
    .map((r) => `{bold}{#ce4-fg}${r.obj.symbol}{/} ${r.obj.name}`)
    .join('\n')
  ws.printLines(results)
}
