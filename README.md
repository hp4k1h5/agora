# iexcli

> query and view stock charts in the terminal using a
> [blessed](https://github.com/chjj/blessed) widgets and a
> [blessed-contrib](https://github.com/yaronn/blessed-contrib) interface

#### !!warning unstable and in early development ⚠
[contributions](./.github/CONTRIBUTING.md) and [bug
reports](https://github.com/HP4k1h5/iexcli/issues/new?assignees=HP4k1h5&labels=bug&template=bug_report.md&title=basic)
are_welcome_

![screen shot of iexcli with one price chart, one volume chart, a repl, and
some stock quote data](img/iexcli.png)

##### Terms of Service for IEX data
[Data provided by IEX Cloud](https://iexcloud.io)

## CHANGELOG

## v0.0.2
- 📖 profile view displays information about the active symbol
- 📔 improved watchlist display and scroll

## v0.0.1
- config.json allows user to set a number of variables. please be careful as
    very few configurations have been tested.
- 📰 news, command `!` will fetch latest 10 news results related to the active
    symbol. can be combined with stock prefix commands. work-in-progress
- 📔 watchlist, command `=` will refresh and focus the watchlist.
    work-in-progress

## installation

### requirements
- [nodeJs](https://nodeJs.org) v10.0+

1) download or clone this repo  
`git clone https://github.com/HP4k1h5/iexcli.git`

2) get dependencies  
run `yarn` in this directory  
or `npm install`

3) add a **publishable** iex api key  
- either export an ENV var named IEX_PUB_KEY  
ex. `export IEX_PUB_KEY=pk_Y0urIeXaPipUbl15h4bLeKEY`
- or set the `IEX_PUB_KEY` in `config.json` in this repo

**register for a free [iex
account](https://iexcloud.io/cloud-login#/register)**
copy the **publishable** api key. These typically start with `pk`

## usage
RUN `node src/index.js` from the root of this directory, or `yarn run run`

Most interaction is through the repl emulator in the bottom right corner of the
screen. It accepts commands and updates the charts and data windows. If a
component has more data than fits on the screen, try scrolling it with the
mouse. Some components also accept, `up` and `down` keys to scroll through
items, such as the watchlist.

Use `tab` or `esc` to return to repl. Hit `enter` to update the components.

Type `help` or `h` for general information. Type e.g. `h $` or `h :` for
command-specific help.

### commands

#### `help` or `h`
Typing `help` or `h` brings up a help menu. If you include another command
name after, command-specific help is returned.  
**examples**
```bash
help $   # show help for stock prefix command
h :      # show help for time prefix command
h        # show general help
```

#### `quit` or `exit`
Typing `quit` or `exit` will exit the app

#### `$` stock ticker symbol prefix
Typing `$` followed immediately by a stock ticker symbol changes the currently
active symbol, updating all visible charts and data windows. Can be combined
with time prefix to update multiple values at the same time  
**examples**
```bash
$tsla          # update active symbol to TSLA
$BRK.B :1.5h   # update active symbol to BRK.B and update time to last 90 minutes
```

#### `:` time range prefix
Typing `:` followed immediately by a combination of the following paramters
will change the currently active time range and update all visible charts and
data windows.  
**valid times ranges** `5d, 1m, 3m, 6m, ytd, 1y, 5y, max`  OR  
numeric values affixed with `min` or `h`, see examples.  
Can be combined with time prefix to update multiple values at the same time  
**examples**
```bash
:100min        # update time to last 100 minutes
:6.5h          # update time to last trading day
:5d  $x        # update time to last 5 days and update stock to X
```

#### `!` news command
Typing `!` brings up the news display with the latest 20 results relevant to
the active symbol. Use arrow keys `up` and `down` to navigate the table. Use
`tab` or `esc` to return to repl. Can be combined with stock prefix to update
multiple values at the same time  
![news display for iexcli](img/news.png)  
**examples**
```bash
$de !          # show news and update active stock to DE
! $ibm         # show news and update stock to ibm
```

#### `=` watchlist command
Typing `=` brings up the watchlist display. Use arrow keys `up` and `down` to
navigate the table. Use `tab` or `esc` to return to repl.  
![watchlist display for iexcli](img/watchlist.png) Key values `open high low
close` are only available to iex premium data subscribers and during
non-market hours to other api consumers.  
**examples**
```bash
=
```

#### `#` chart command
Typing `#` brings up the price/volume chart display.
**examples**
```bash
# :1d $t
```

#### `&` profile command
Typing `&` brings up a profile of the active symbol. Use mouse to scroll
components.
![profile display](img/profile.png)  
**examples**
```bash
$qcom &
```
