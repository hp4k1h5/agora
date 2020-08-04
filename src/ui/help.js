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
prefix stock ticker symbols with {#cd2-fg}\${/} to change the active symbol. Including a $-prefix will automatically update all charts and tables
ex. {#cd2-fg}$brk.b{/}
ex. {#cd2-fg}$GOOG{/}`
    const whatTime = `
    {bold}{#2ea-fg}help {#cd2-fg}:{/} (time range)
prefix valid time ranges with {#cd2-fg}:{/} to change the active time range. Including a :-prefix will automatically update all the charts and tables
{bold}{#2ea-fg}valid time ranges:{/}
${ws.validUnits.map((u) => '{#cd2-fg}:' + u + '{/}').join(' ')}
AND numbers with minute {#cd2-fg}min{/} or hour {#cd2-fg}h{/}
ex. {#cd2-fg} :100min {/}{#ddd-fg} last 100 minutes of aggregated trading data{/}
ex. {#cd2-fg} :6.5h {/}{#ddd-fg}{/}  last 6.5 hours of minute aggregated trading data`
    const whatExit = `
    {bold}{#2ea-fg}help {#cd2-fg}exit | quit{/} (time range)
exits iexcli`

    const whats = {
      $: whatSym,
      ':': whatTime,
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
    ws.printLines(`
    {bold}{#2ea-fg}help menu{/} 
{bold}available commands:{/}
{#cd2-fg}h(elp){/}   :prints this menu
{#cd2-fg}\${/}        :ticker symbol prefix
          changes active symbol
          ex. {#cd2-fg}$qqq{/}
          try {#cd2-fg}help \${/}
{#cd2-fg}\:{/}        :time (range) prefix
          changes active time range
          ex. {#cd2-fg}:6m{/}
          try {#cd2-fg}help \:{/}

these commands can be aggregated:
    ex. {#cd2-fg}$z :10h{/}
    ex. {#cd2-fg}:1y $GM{/}

{#cd2-fg}exit / quit{/}     :quit iexcli`)
}
