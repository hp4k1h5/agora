export function help(self, words) {
  // handle help arguments if any
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
${self.validUnits.map((u) => '{#cd2-fg}:' + u + '{/}').join(' ')}
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
    return whats[what] ? whats[what] : `{red-fg}error{/}: no help for ${what}`
  }

  // return full help
  return `
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

{#cd2-fg}exit / quit{/}     :quit iexcli`
}
