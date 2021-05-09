import blessed from '@hp4k1h5/blessed'
import { defaults } from '../util/defaults.js'
import { validUnits } from '../util/config.js'
import { clear } from '../util/clear.js'

export const intro = `{#2ea-fg}Welcome to iexcli.{/}
  Data provided by IEX Cloud 
  {blue-fg}<https://iexcloud.io>{/}

  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} for help. 

  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}...`

const fullHelp = `   {bold}{#2ea-fg}help menu{/} 
try {#cd2-fg}help <command>{/} for command specific help
  e.g. {#cd2-fg}help :{/}
       {#cd2-fg}help \${/}

{#bf6-fg}go back{/} to repl with {#cd2-fg}>{/}
{red-fg}close{/} this window with {#cd2-fg}x{/}
or use {#cd2-fg}tab/Shift-tab{/} to rotate through components

{#eb4-fg}scroll down for more...{/}

{bold}available commands:{/}
{#bf6-fg}---------------------{/}
{#cd2-fg}h(elp){/}   :prints this menu
{#bf6-fg}---------------------{/}
{#cd2-fg}[{/}        :target (window) prefix
         :changes the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}[new{/}     :open new window in workspace
{#bf6-fg}---------------------{/}
{#cd2-fg}[all{/}     :target all windows in workspace
{#bf6-fg}---------------------{/}
{#cd2-fg}x{/}        :close active window
{#bf6-fg}---------------------{/}
{#cd2-fg}\${/}        :ticker (symbol) prefix
         :changes the active ticker symbol
{#bf6-fg}---------------------{/}
{#cd2-fg}:{/}        :time (range) prefix
         :changes the active time range
{#bf6-fg}---------------------{/}
{#cd2-fg}#/chart{/}  :display chart in targeted window
{#bf6-fg}---------------------{/}
{#cd2-fg}%{/}        :technical (indicator) prefix
         :adds a technical indicator to targeted chart window 
         :{#f5c-fg}(paid iex subscribers only){/}
{#bf6-fg}---------------------{/}
{#cd2-fg}^/book{/}        :book
         :display order book in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}"/quote{/}        :quote
         :display quote in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}!/news{/}        :news
         :display news in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}=/watchlist{/}        :watchlist
         :display watchlist in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}&/profile{/}:profile
         :display company profile in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}*/list{/}   :list
         :display active/gainers/losers list in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}sectors{/}  :display sectors info in the active window
{#bf6-fg}---------------------{/}
{#cd2-fg}poll{/}     :poll (milliseconds) prefix
         :sets polling to (milliseconds) in the target window
         :enter {#cd2-fg}poll{/} with no time argument to stop polling.
         :ex: {#cd2-fg}poll1e4{/} poll every second
         :ex: {#cd2-fg}[1 poll{/} stop polling in window 1
{#bf6-fg}---------------------{/}
{#cd2-fg}?{/}        :search (terms)
{#bf6-fg}---------------------{/}
{#cd2-fg}@/account{/}:account
         :display iex/alpaca account info in the active window

{#bf6-fg}-----------------------------{/}

{bold}Alpaca commands{/}
{#cd2-fg}@{/}        :account {#f5c-fg}requires alpaca keys{/}
{#cd2-fg}+{/}        :buy (quantity) (symbol) {#f5c-fg} requires alpaca keys{/}
{#cd2-fg}-{/}        :sell (quantity) (symbol) {#f5c-fg} requires alpaca keys{/}
{#cd2-fg}exit / quit / <Ctrl-c>{/}     :quit iexcli

{#bf6-fg}-----------------------------{/}

commands can be aggregated:

ex. {#cd2-fg}$z # :10h %bbands{/}  -> 10 hour chart for $Z  in the last active
    window with bollinger bands technical indicator
ex. {#cd2-fg}$GM ! [3{/}  -> news for $gm in the 3rd window
ex. {#cd2-fg}[2 x{/}  -> close the 2nd window
ex. {#cd2-fg}[all $tm{/}  -> update all targetable components with ticker
    symbol $tm


{#eb4-fg}scroll up for more...{/}`

export function halp(ws) {
  const options = defaults.help
  options.id = 'help'
  ws.options.components.push(options)

  clear(ws, options)

  options.box = ws.grid.set(...options.yxhw, blessed.text, {
    name: 'help',
    label: `[${options.id} help]`,
    // inputs
    keys: false,
    input: true,
    mouse: true,
    scrollable: true,
    // styles
    tags: true,
    style: {
      focus: { border: { fg: '#ddf' } },
    },
  })

  // add focus listeners
  ws.setListeners(options)

  options.box.setContent(fullHelp)
}

export function help(ws, words) {
  // print specific help if applicable
  let what = words[words.findIndex((w) => /h(elp)?/.test(w)) + 1]

  if (what) {
    const whatSym = `
    {bold}{#2ea-fg}help {#cd2-fg}\${/} (symbol)
Prefix stock ticker symbols with {#cd2-fg}\${/} to change the active symbol.
Including a $-prefix will update the active component.
ex. {#cd2-fg}$brk.b{/}`
    const whatTime = `
    {bold}{#2ea-fg}help {#cd2-fg}:{/} (time range)
Prefix valid time ranges with {#cd2-fg}:{/} to change the active time range.
Including a :-prefix will update the active component
    {bold}{#2ea-fg}valid time ranges:{/}
${validUnits.map((u) => '{#cd2-fg}:' + u + '{/}').join(' ')}
AND numbers with minute {#cd2-fg}min{/} or hour {#cd2-fg}h{/}
ex. {#cd2-fg} :6.5h {/}`
    const whatChart = `
    {bold}{#2ea-fg}help {#cd2-fg}#{/} chart
Display chart. Can be combined with time and stock prefixes to update multiple
fields at once, or used by itself to switch from news or watchlist views to
    chart view.
ex. {#2ea-fg}$r :6.5h #{/}`
    const whatQuote = `
    {bold}{#2ea-fg}help {#cd2-fg}"{/} quote
Display quote.
ex. {#2ea-fg}" $de{/}`
    const whatNews = `
    {bold}{#2ea-fg}help {#cd2-fg}!{/} news
Display news. 
ex. {#2ea-fg}! $c{/}`
    const whatWatch = `
    {bold}{#2ea-fg}help {#cd2-fg}={/} watchlist
Display watchlist. Watchlist symbols can be set in config.json`
    const whatProfile = `
    {bold}{#2ea-fg}help {#cd2-fg}&{/} profile
Display company financial profile information`
    const whatBook = `
    {bold}{#2ea-fg}help {#cd2-fg}^{/} book
Display order book data for the active symbol`
    const whatSectors = `
    {bold}{#2ea-fg}help {#cd2-fg}sectors{/} sectors
Display sectors info`
    const whatList = `
    {bold}{#2ea-fg}help {#cd2-fg}*{/} list
Display lists. You can set which lists you wish to bring back by altering the
    config.json. See README`
    const whatSearch = `
    {bold}{#2ea-fg}help {#cd2-fg}?{/} (terms)
Search for terms by typing a {yello-fg}?{/} and words to look up symbol and
    company names with.
ex. {#2ea-fg}? solar{/}
ex. {#2ea-fg}aviation engineering ?{/}`
    const whatWindow = `
    {bold}{#2ea-fg}help {#cd2-fg}[{/} target (window id)
Target a specfic window by id. Window id is located in the top left corner of
    the component. Can be combined with other commands.
ex. {#2ea-fg}[2 # $aa :6.5h{/}
ex. {#2ea-fg}& [1{/}`
    const whatPoll = `
    {bold}{#2ea-fg}help {#cd2-fg}poll{/} poll (milliseconds)
All components can be polled. Components that are polling will refresh
themselves at the specified interval in milliseconds. {#2ea-fg}poll{/} by
itself with no ms argument will stop polling in the active window.
ex. {#2ea-fg}$aa :6.5h poll60000{/}  --> poll once per minute same as 
ex. {#2ea-fg}poll6e4 $aa :6.5h {/}   --> poll once per minute 
ex. {#2ea-fg}poll [1{/}              --> stop polling in window 1`
    const whatAccount = `
    {bold}{#2ea-fg}help {#cd2-fg}@/account{/} account
Display information about your iex and alpaca accounts`
    const whatBuy = `
    {bold}{#2ea-fg}help {#cd2-fg}+{/} BUY (quantity) (symbol)
BUY (quantity) of (symbol)
ex. {#2ea-fg}+100 $aa {/}   -> buy 100 shares of $aa`
    const whatSell = `
    {bold}{#2ea-fg}help {#cd2-fg}-{/} SELL (quantity) (symbol)
BUY (quantity) of (symbol)
ex. {#2ea-fg}-10 $s {/}   -> sell 100 shares of $s`
    const whatExit = `
    {bold}{#2ea-fg}help {#cd2-fg}exit{/} | {#cd2-fg}quit{/}
Exits iexcli`

    const whats = {
      $: whatSym,
      ':': whatTime,
      '#': whatChart,
      '"': whatQuote,
      '^': whatBook,
      '&': whatProfile,
      '*': whatList,
      '!': whatNews,
      sectors: whatSectors,
      '=': whatWatch,
      '[': whatWindow,
      poll: whatPoll,
      '@': whatAccount,
      '?': whatSearch,
      '+': whatBuy,
      '-': whatSell,
      exit: whatExit,
      quit: whatExit,
    }
    ws.printLines(
      whats[what]
        ? whats[what].split('\n')
        : `{red-fg}error{/}: no help for ${what}`,
    )
  }

  // print full help
  else halp(ws)
}
