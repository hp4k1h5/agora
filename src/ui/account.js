import blessed from '@hp4k1h5/blessed'
import contrib from '@hp4k1h5/blessed-contrib'

import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

export function buildAccount(ws, options, data) {
  clear(ws, options)

  let [iex, alpaca] = []
  if (!data) {
    ;[iex, alpaca] = [
      '{red-fg}no iex account data{/}',
      '{red-fg}no alapaca account data{/}',
    ]
  } else {
    ;[iex, alpaca] = data
  }

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'account',
    label: `[${options.id}  account ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    // inputs
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: false,
    scrollable: false,
    // styles
    tags: true,
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  const width = Math.floor(options.box.width / 3) - 1
  const height = Math.floor(options.box.height / 2) - 1

  const accountAlpaca = blessed.text({
    parent: options.box,
    name: 'alpaca account',
    label: 'alpaca account',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    width: width * 2,
    height,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const positionsAlpaca = blessed.text({
    parent: options.box,
    name: 'positions',
    label: 'alpaca positions',
    // inputs
    mouse: true,
    scrollable: true,
    // styles
    top: height,
    width: width * 2,
    height,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  // iex
  const iexBox = blessed.box({
    parent: options.box,
    name: 'iex',
    label: `[${options.id}  iex  ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: false,
    scrollable: false,
    // styles
    tags: true,
    left: width * 2,
    height,
    width,
    border: { type: 'line' },
    style: {
      border: { fg: '#4be' },
    },
  })

  const headerIex = blessed.text({
    parent: iexBox,
    name: 'iex header',
    // styles
    tags: true,
  })

  const dailyUsageIex = contrib.sparkline({
    parent: iexBox,
    inputs: false,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    top: 2,
    left: 2,
  })

  const keyUsage = contrib.gauge({
    // parent: iexBox, // see next comment
    label: 'key usage',
    inputs: false,
    // styles
    tags: true,
    top: 7,
    height: 5,
    width: width - 2,
  })
  // can't find reason why this is necessary in contrib
  iexBox.append(keyUsage)

  const keyNames = blessed.text({
    parent: iexBox,
    inputs: false,
    // styles
    tags: true,
    height: 1,
    width: width - 2,
    top: 12,
  })

  // set data with or without data
  if (!iex || !iex.stats) {
    headerIex.setContent(iex)
  } else {
    headerIex.setContent(
      `  {#afb-fg}msg monthly{/}:${iex.stats.mu.toLocaleString()} ::  {#afb-fg}msg pay:{/}${iex.stats.payg.toLocaleString()}`,
    )
    const date = new Date()
    dailyUsageIex.setData(
      [`daily iex msg ${date.getMonth() + 1}/${date.getFullYear()}`],
      iex.dailyUsage,
    )
    keyUsage.setStack(iex.keyUsage)
    keyNames.setContent(iex.keyUsage.map((k) => k.key).join(' '))
  }

  accountAlpaca.setContent(alpaca.account)
  if (alpaca) {
    positionsAlpaca.setContent(alpaca.positions)
  }
}
