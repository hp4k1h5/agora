import robots from '../../bots.js'
import { carousel } from '../index.js'

import { setSymbol, setTime } from '../util/parse.js'
import { shapeBots } from '../shape/shapeBots.js'
import { buildBots } from '../ui/bots.js'
import { handleErr } from '../util/error.js'

export const botMap = {}

export async function bots(ws, words) {
  // bots list
  if (words.findIndex((w) => ['list', 'ls'].includes(w)) > -1) {
    ws.printLines(
      Object.keys(robots).map(
        (robot) =>
          `${robot} ..${
            botMap[robot] ? '{#cfe-fg}running{/}' : '{#e7a-fg}stopped{/}'
          }`,
      ),
    )
    return
  }

  let bot

  const stop = words.findIndex((w) => w == 'stop')
  if (stop > -1) {
    bot = words[stop + 1]
    if (!robots[bot]) {
      handleErr(ws, `no such bot name  ${bot}`)
      return bots(ws, ['ls'])
    }
    clearInterval(botMap[bot])
    delete botMap[bot]
    return
  }

  const start = words.findIndex((w) => ['start'].includes(w))
  if (start > -1) {
    bot = words[start + 1]
    if (!robots[bot]) {
      handleErr(ws, `no such bot name  ${bot}`)
      return bots(ws, ['ls'])
    }
  }

  let botOptions
  botOptions = {
    ...(ws.options.components.find((c) => c.type == 'bots') || {}),
    symbol: true,
  }
  setSymbol(botOptions, words)
  setTime(ws, botOptions, words)

  botOptions.print = (botInfo) => {
    if (!botOptions.id) {
      ws.printLines(JSON.stringify(botInfo, null, 2))
      return
    }

    botInfo = shapeBots(botInfo)

    if (carousel.currPage == botOptions.wsId) {
      buildBots(ws, botOptions, botInfo)
    }
  }

  if (!robots[bot]) {
    handleErr(ws, `no such bot name ${bot}`)
    return bots(ws, ['ls'])
  }

  clearInterval(botMap[bot])
  botMap[bot] = await robots[bot](ws, botOptions)
}
