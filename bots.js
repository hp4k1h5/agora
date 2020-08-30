// import your bots from anywhere
import { alpha } from './docs/bots/alpha.js'

// include them in the exports here if you want iexcli to be enable you to
// manage them
export default {
  alpha,
  beta,
}

// you can also create functions in this file and export them above
//

function beta(ws) {
  ws.printLines('{blue-fg}hello world{/}')
}
