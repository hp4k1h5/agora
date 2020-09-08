import robots from '../../bots.js'
import { carousel } from '../index.js'

import { evaluate } from '../ui/evaluate.js'
import { setSymbol, setTime } from '../util/parse.js'
import { shapeBots } from '../shape/shapeBots.js'
import { buildBots } from '../ui/bots.js'
import { handleErr } from '../util/error.js'

export const botMap = {}

export async function bots(ws, words) {
  // handle bots component request first by checking for window prefix
  const windowPrefix = words.find((w) => w[0] == '[')
  if (windowPrefix) {
    words[words.findIndex((w) => w == 'bots')] = 'b0ts'
    return evaluate(ws, words.join(' '))
  }
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

  let botOptions = ws.options.components.find((c) => c.type == 'bots')
  botOptions = {
    ...botOptions,
    ...{
      type: 'bots',
      time: '1d',
    },
  }
  setSymbol(botOptions, words)
  setTime(ws, botOptions, words)

  botOptions.print = (botInfo) => {
    if (carousel.currPage != botOptions.wsId) {
      return
    }

    let botComponent = ws.options.components.find((c) => c.type == 'bots')
    if (!botComponent) return

    botOptions.id = botComponent.id
    botInfo = shapeBots(botInfo)

    buildBots(ws, botOptions, botInfo)
  }

  if (!robots[bot]) {
    handleErr(ws, `no such bot name ${bot}`)
    return bots(ws, ['ls'])
  }

  clearInterval(botMap[bot])
  // pass ws and botOptions to bot
  botMap[bot] = await robots[bot](ws, botOptions)
}
