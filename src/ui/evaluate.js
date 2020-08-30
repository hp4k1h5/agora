import { update } from './update.js'
import {
  setOrder,
  setTargets,
  setComponentOptions,
  setTime,
  setSymbol,
} from '../util/parse.js'
import { search as fuzzySearch } from './search.js'
import { bots } from '../bots/bots.js'
import { help } from './help.js'
import { handleErr } from '../util/error.js'

export async function evaluate(ws, input) {
  // define command to execute
  const commands = {
    exit,
    quit: exit,
    help,
    h: help,
    '?': search,
    search,
    bots,
    undefined,
    chart: 'chart',
    '#': 'chart',
    '^': 'book',
    book: 'book',
    quote: 'quote',
    '"': 'quote',
    news: 'news',
    '!': 'news',
    watchlist: 'watchlist',
    '=': 'watchlist',
    profile: 'profile',
    '&': 'profile',
    list: 'list',
    '*': 'list',
    sectors: 'sectors',
    orders: 'orders',
    positions: 'positions',
    '@': 'account',
    // prefix commands are not included here and are treated separately
    // they include the following symbols and words.
    // // symbol prefixes
    // :         time
    // $         symbol
    // [         window
    // %         technical-indicator
    // // word prefixes
    // poll      poll
  }

  // parse input
  const words = input.split(/\s+/g)

  // handle orders separately
  const order = await setOrder(ws, { wsId: ws.id, q: {} }, words)
  if (order) return

  // find ui commands
  const command = commands[words.find((w) => commands[w])]

  // execute repl fns next
  if (typeof command == 'function') return await command(ws, words)

  // parse inputs
  const targets = setTargets(ws, words, command)
  if (!targets.length) return
  targets.forEach((target) => {
    setComponentOptions(ws, target, words, command)

    setSymbol(target, words)
    setTime(ws, target, words)
  })

  try {
    await Promise.all(
      targets.map(async (target) => {
        await update(ws, target)
      }),
    )
  } catch (e) {
    handleErr(e)
  }
}

export function exit(ws) {
  ws.printLines('{#abf-fg}\ngoodbye...{/}')
  setTimeout(() => {
    ws.options.screen.destroy()
    process.exit(0)
  }, 730)
}

function search(ws, words) {
  words = words.filter((w) => w != '?').join(' ')
  let results = fuzzySearch(words)
  results = results
    .map((r) => `{bold}{#ce4-fg}${r.obj.symbol}{/} ${r.obj.name}`)
    .join('\n')
  ws.printLines(results)
}
