import { validUnits } from '../util/config.js'

export const intro = `{#2ea-fg}Welcome to iexcli.{/}
  Data provided by IEX Cloud 
  {blue-fg}<https://iexcloud.io>{/}

  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} for help. 

  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}...`

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
    const whatNews = `
    {bold}{#2ea-fg}help {#cd2-fg}!{/} news
Display news. Can be combined with stock prefixes to update the active symbol
and switch to news view
ex. {#2ea-fg}! $c{/}`
    const whatWatch = `
    {bold}{#2ea-fg}help {#cd2-fg}={/} watchlist
Display watchlist. Watchlist symbols can be set in config.json`
    const whatProfile = `
    {bold}{#2ea-fg}help {#cd2-fg}&{/} profile
Display profile`
    const whatList = `
    {bold}{#2ea-fg}help {#cd2-fg}*{/} list
Display lists. You can set which lists you wish to bring back by altering the
    config.json`
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
      '!': whatNews,
      '=': whatWatch,
      '#': whatChart,
      '&': whatProfile,
      '*': whatList,
      '?': whatSearch,
      '[': whatWindow,
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
  else
    ws.printLines(`   {bold}{#2ea-fg}help menu{/} 
try {#cd2-fg}help <command>{/} i.e. {#cd2-fg}help :{/}
{bold}available commands:{/}
{#cd2-fg}h(elp){/}   :prints this menu
{#cd2-fg}\${/}        :ticker (symbol) prefix
{#cd2-fg}:{/}        :time (range) prefix
{#cd2-fg}[{/}        :target (window) prefix
{#cd2-fg}!{/}        :news
{#cd2-fg}={/}        :watchlist
{#cd2-fg}#{/}        :chart
{#cd2-fg}&{/}        :profile
{#cd2-fg}?{/}        :search (terms)
{#cd2-fg}*{/}        :list
{#cd2-fg}+{/}        :buy (quantity) (symbol)
{#cd2-fg}-{/}        :sell (quantity) (symbol)
{#cd2-fg}exit / quit{/}     :quit iexcli)
{#fcc-fg}-----------------------------{/}
commands can be aggregated:
ex. {#cd2-fg}$z # :10h{/}  -> 10 hour chart for $Z 
ex. {#cd2-fg}$GM !{/}  -> news for $gm
{#eb4-fg}scroll up for more...{/}`)
}
