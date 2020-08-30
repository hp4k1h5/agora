import blessed from '@hp4k1h5/blessed'

import { clear } from '../util/clear.js'
import { spin } from '../util/spin.js'

export function buildPositions(ws, options, data) {
  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'positions',
    label: `[${options.id}  positions ${
      options.pollMs ? ' .. polling ' + spin() : ''
    }]`,
    // inputs
    keys: false,
    // input is true for focus rotation
    input: true,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    style: {
      focus: { border: { fg: '#fc5' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  // set data
  if (!data) return
  // shape data again for narrow box
  data = data
    .map((d) => {
      return `{#cd2-fg}${d.symbol}{/}   {#${
        d.side == 'long' ? 'bfa' : 'fab'
      }-fg}${d.side.toUpperCase()}{/}
${d.qty} @ ${d.avg_entry_price}/shr
mktval ${d.market_value}
- cost ${d.cost_basis}
= pl   ${d.unrealized_pl} -> ${d.unrealized_plpc}

day pl ${d.unrealized_intraday_pl} -> ${d.unrealized_intraday_plpc}
price  ${d.current_price}
last price ${d.lastday_price}`
    })
    .join('\n{bold}{#bbb-fg}---------------{/}\n')
  options.box.setContent(data)
}
