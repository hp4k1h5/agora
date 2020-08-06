export const intro = `{#2ea-fg}Welcome to iexcli.{/}
  Data provided by IEX Cloud 
  {blue-fg}<https://iexcloud.io>{/}

  type {bold}{#cd2-fg}h{/} or {bold}{#cd2-fg}help{/} for help. 

  more documentation is available at 
  {underline}{#4be-fg}<https://github.com/hp4k1h5/iexcli>{/}...
\n\n\n `.split('\n')

export function help(ws, _c, words) {
  // print specific help if applicable
  let what = words[words.findIndex((w) => /h(elp)?/.test(w)) + 1]
  if (what) {
    const whatSym = `
    {bold}{#2ea-fg}help {#cd2-fg}\${/} (symbol)
Prefix stock ticker symbols with {#cd2-fg}\${/} to change the active symbol. Including a $-prefix will update the active component.
ex. {#cd2-fg}$brk.b{/}`
    const whatTime = `
    {bold}{#2ea-fg}help {#cd2-fg}:{/} (time range)
Prefix valid time ranges with {#cd2-fg}:{/} to change the active time range. Including a :-prefix will update the active component
    {bold}{#2ea-fg}valid time ranges:{/}
${ws.validUnits.map((u) => '{#cd2-fg}:' + u + '{/}').join(' ')}
AND numbers with minute {#cd2-fg}min{/} or hour {#cd2-fg}h{/}
ex. {#cd2-fg} :6.5h {/}{#ddd-fg}{/}`
    const whatChart = `
    {bold}{#2ea-fg}help {#cd2-fg}#{/} chart
Display chart. Can be combined with time and stock prefixes to update multiple fields at once, or used by itself to switch from news or watchlist views to chart view.
ex. {#2ea-fg}$r :6.5h #`
    const whatNews = `
    {bold}{#2ea-fg}help {#cd2-fg}!{/} news
Display news. Can be combined with stock prefixes to update the active symbol and swith to news view
ex. {#2ea-fg}! $c{/}`
    const whatWatch = `
    {bold}{#2ea-fg}help {#cd2-fg}={/} watchlist
Display watchlist.`
    const whatExit = `
    {bold}{#2ea-fg}help {#cd2-fg}exit | quit{/} (time range)
Exits iexcli`

    const whats = {
      $: whatSym,
      ':': whatTime,
      '!': whatNews,
      '=': whatWatch,
      '#': whatChart,
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
{#cd2-fg}\${/}        :ticker symbol prefix
{#cd2-fg}:{/}        :time (range) prefix
{#cd2-fg}!{/}        :news
{#cd2-fg}={/}        :watchlist
{#cd2-fg}#{/}        :chart
{#cd2-fg}exit / quit{/}     :quit iexcli)
{#fcc-fg}-----------------------------{/}
commands can be aggregated:
ex. {#cd2-fg}$z :10h{/}  -> 10 hour chart for Z 
ex. {#cd2-fg}$GM !{/}  -> news for GM`)
}
