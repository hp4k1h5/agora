import { config } from './config.js'
import { carousel } from '../index.js'
import { defaults } from './defaults.js'
import { validUnits, validIndicators } from './config.js'
import { help } from '../ui/help.js'
import { handleErr } from './error.js'

export function initComponent(ws, options) {
  options.id = ws.id()
  options.wsId = ws.options.id
  options.q = {}

  ws.options.screen.on('move', () => {
    // cancel all requests from last ws in flight
    Object.keys(options.q).forEach((url) => {
      if (carousel.currPage != options.wsId) {
        options.q[url] = Infinity
      } else {
        delete options.q[url]
      }
    })
  })

  setComponentOptions(ws, options, [], null)
  setTime(ws, options, [`:${options.time}`])
}

export function setTargets(ws, words, command) {
  // find target component
  let targets
  const _new = words.find((w) => w == '[new')
  const _all = words.find((w) => w == '[all')
  if (!_new) {
    let tIds
    if (_all) {
      tIds = ws.options.components.filter((c) => c.id).map((c) => c.id)
    } else {
      tIds = words.filter((w) => w[0] == '[').map((w) => +w.substring(1))
    }
    tIds = tIds.length ? tIds : null
    if (tIds) {
      targets = ws.options.components.filter((c) => tIds.includes(c.id))
      if (tIds && !targets.length) {
        ws.printLines(
          `{red-fg}err:{/} no such component id ${tIds.filter(
            (tId) => !targets.includes(tId),
          )}`,
        )
        return []
      }
    }

    targets = targets ? targets : [ws.prevFocus]

    targets = targets.map((target) => {
      if (command && target.type != command) {
        delete target.type
        target = { ...defaults[command], ...target }
        ws.options.components.splice(
          ws.options.components.findIndex((c) => c.id == target.id),
          1,
          target,
        )
      }
      return target
    })
  } else if (_new) {
    targets = defaults[command]
    initComponent(ws, targets)
    setSymbol(targets, words)
    ws.options.components.push(targets)
    targets = [targets]
  }

  return targets
}

export function setComponentOptions(ws, target, words) {
  if (target.type == 'chart') {
    // set technical indicator
    const indicator = words.find((w) => w[0] == '%')
    if (indicator) {
      target.indicator = indicator.substring(1)
      if (!target.indicator.length) {
        delete target.indicator
      } else {
        const indicatorOptions = validIndicators.find(
          (i) => i.name == target.indicator,
        )
        if (!indicatorOptions) {
          // TODO fuzzy search indicators
          handleErr(ws, `no such indicator ${target.indicator}`)
          delete target.indicator
        } else {
          target.indicator = indicatorOptions
        }
      }
    }
  } else if (target.type == 'watchlist') {
    target.watchlist = target.watchlist ||
      ws.options.watchlist ||
      config.watchlist || ['goog']
    if (target.watchlist == 'alpaca') {
      target.type = 'watchlistAlpaca'
    }
  }
}

// only set if component has symbol & user entered symbol
export function setSymbol(options, words) {
  const symbol = words.find((w) => /(?<=^\$|¢)[\w.]+/.test(w))
  if (!symbol) return

  options.symbol = symbol.slice(1)
  if (symbol[0] == 'c') options.crypto = true
}

// only set if component has time & user entered time
export function setTime(ws, options, words) {
  let poll = words.find((w) => /poll[\d.]*/.test(w))
  if (poll && !['bots'].includes(options.type)) {
    poll = +poll.match(/[\d|e]+$/)
    if (!poll) {
      clearInterval(options.interval)
      delete options.interval
      delete options.pollMs
    } else if (poll > 0 && poll < 10) {
      throw 'cannot set polling interval below 10 milliseconds'
    } else {
      options.pollMs = poll
    }
  }

  if (!options.time) return

  // find time
  let time = words.find((w) => /(?<=:)\S+/.test(w))
  if (!time && options._time) return

  if (!options._time) {
    time = options.time
  } else {
    time = time.slice(1)
  }

  // handle intraday
  const intra = time.match(/([\d.]+)(min|h)/)
  if (intra) {
    options.series = 'intra'
    options.time = intra[0]
    options._time = {
      chartLast: +intra[1] * (intra[2] == 'h' ? 60 : 1),
    }
  } else if (time == '1d') {
    options.series = 'intra'
    options.time = time
    options._time = { chartLast: 1000 }
  } else {
    // handle historical
    if (!validUnits.includes(time)) {
      ws.printLines(`{red-fg}err:{/} invalid time`)
      help(ws, ['h', ':'])
      return
    }
    options.series = 'hist'
    options.time = time
    options._time = time
  }
}
