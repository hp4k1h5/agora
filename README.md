# iexcli

> view market info and charts and trade stocks in the terminal

#### !!warning iexcli is in alpha and subject to change ⚠
[contributions](./.github/CONTRIBUTING.md) and [bug
reports](https://github.com/HP4k1h5/iexcli/issues/new?assignees=HP4k1h5&labels=bug&template=bug_report.md&title=basic)
are_welcome_

![screen shot of iexcli with one price chart, one volume chart, a repl, and
some stock quote data](img/iexcli.png)

##### Terms of Service for IEX data
[Data provided by IEX Cloud](https://iexcloud.io)

- [CHANGELOG](#changelog)
- [installation](#installation)
- [usage](#usage)
  - [commands](#commands)
- [trading](#trading)
- [thanks](#thanks)


## CHANGELOG

### v0.0.10
- 📺 improved window handling. `[new` keyword opens new windows. `x`
    closes targeted window. `[all` updates all targetable windows.
- ℹ new help component. type `h` or `help`
- `>` better repl focus and front behavior. English keywords for all commands.
- 📉📈 technical indicators. use `%` indicator prefix to
    overlay indicators, such as bollinger bands `%bbands`, weighted move
    average `%wma` and more. currently only a limited subset of iex's
    technical indicators will display correctly. _requires a paid iex
    subscription._ See [technical indicator](./README.md#technical-indicator)
- 📊 sector performance

### v0.0.8
- 🐛 bugfix for '>' return to repl command in carousel mode
- 🐴 [alpaca](https://alpaca.markets/) integration. Users can now trade with
    alpaca api and see account and positions info. See
    [trading](#trading)

## installation

### requirements
- [nodeJs](https://nodeJs.org) ✅ tested with `v14.8.0`

1) download or clone this repo
    1) either `git clone https://github.com/HP4k1h5/iexcli.git` and get
      dependencies by running `yarn` in this directory
    2) or run `yarn global add @hp4k1h5/iexcli`  OR  `npm i -g @hp4k1h5/iexcli`

2) add a **publishable** iex api key
    1) either export an ENV var named [IEX_PUB_KEY](#register)  
    ex. `export IEX_PUB_KEY=pk_Y0urIeXaPipUbl15h4bLeKEY` locally or in your
    `.bashrc` equivalent.
    2) or set the `IEX_PUB_KEY` in `config.json` in this repo, or the default
    config location, on a mac, this will be `~/.config/iexcli/config.json`.
    *You will have to create the directory with e.g.* `mkdir
    ~/.config/iexcli`, and then copy over your config with e.g. on a mac
    ```bash
    cp  ~/.config/yarn/global/node_modules/@hp4k1h5/iexcli/config.json ~/.config/iexcli
    ```
    You can copy the default config from this repo

#### register
**for a free [iex account](https://iexcloud.io/cloud-login#/register)** and
copy the **publishable** api key. These typically start with `pk`


## usage

### getting started

If you installed globally, you should be able to use the bash alias `iexcli`
from anywhere. Be sure to refresh your terminal, e.g. `exec zsh` or start a
new terminal window after installing so that the alias can be found. If you
still cannot find an alias, try running `yarn link` from this project
directory root. Otherwise, if you downloaded with git or to a local directory,
RUN `node src/index.js` from the root of this directory, or `yarn run run`.

Most interaction is through the repl emulator screen. It accepts commands and
updates the charts and data windows. If a component has more data than fits on
the screen, try scrolling it with the mouse.

Type `help` or `h` for general information. Type e.g. `h $` or `h :` for
command-specific help. If your terminal allows it, you can scroll through the
help.

### focus and windows

Use `tab` and `Shift-tab` to rotate through components. To return directly to
repl hit `>`, the "greater-than" sign. The last focused component will be the
one targeted by the command. When you start typing in the repl, the last
focused component should be highlighted with a yellow border.

Type `esc` from the repl to re-enter the focus-rotation. It can be confusing
and if you return directly to the repl when you expected to rotate, try going
in the other direction, i.e. `Shift-tab` instead of `tab` or vice-versa.

Every targetable window in iexcli should have a number in the top-left corner
of the screen. From the repl you can type a `[` window prefix to target a
specific window with a command. For instance, in this example:

![iexcli running with multiple open windows](img/targeting.png)

the command `[3 $aapl !` would switch the 3 window to a news view of $appl.

![after running the \[`3 $aapl !` command](img/targeted.png)

### commands

#### `help` or `h`
Typing `help` or `h` brings up a help menu. If you include another command
name after, command-specific help is returned to the repl.  
**examples**
```fortran
help $   # show help for stock prefix command
h :      # show help for time prefix command
h #      # show help for chart command
h        # show general help
```

#### `quit` or `exit`
Typing `quit`, `exit` or `Ctrl-c` will exit the app

#### `[` window id prefix
Typing a `[` followed immediately by a window id, or one of the keywords `all`
or `new` will target the window(s) with the command. Window ids are found in the
top-left corner of each targetable window.  
**examples**
```fortran
[4 # :max $tm  --> display max-time chart of $tm in the fourth window
$aa [all       --> update all targetable windows with stock symobl $aa
[2 x           --> close the second window
= [new         --> open a new watchlist window
```

#### `x` close window
Typing an x will close the active window. May be combined with window prefix
to target a specific window.
**examples**
```c
[4  x       --> closes the 4th window
x           --> closes the active window
```

#### `?` search
Typing `?` followed by search terms will query stock symbols and company names
for approximate (fuzzy) matches. Capitalization and spacing is ignored as are
quotes and most other non word symbols.
If you are searching by key word like "solar", consider adding more words to
narrow down the result set  
**examples**  
```bash
? electric
   tlsa    ?  
?   "american Motor" company
```

#### `$` stock ticker symbol prefix
Typing `$` followed immediately by a stock ticker symbol changes the symbol in
the active window. Can be combined with window, technical-indicator and time
prefixes to update multiple values at the same time  
**examples**
```fortran
$TM              --> update symbol in active component to TSLA
[2 $BRK.B :1.5h   --> update active symbol to BRK.B and update time to last 90 minutes
```

#### `#` chart command
Typing `#` brings up the price/volume chart display in the targeted window.
You may also set time, technical-indicator, and stock symbol by including
those prefix-commands in the query.  
**examples**
```c
# :1dm $t     --> change the active window to a 1 day 5-minutes chart of $t
[2 # %wma     --> change the second window to a chart with
                  weighted-moving-average overlay
```

#### `:` time range prefix
Typing `:` followed immediately by a combination of the following parameters
will change the currently active time range and update the currently active
window. This will only apply to chart windows.  
**valid time ranges** `1d, 5d, 5dm, 1m, 1mm, 3m, 6m, ytd, 1y, 5y, max`  OR  
numeric values affixed with `min` or `h`, see examples.  
Can be combined with time prefix to update multiple values at the same time  
**examples**
```bash
:100min        --> update time to last 100 minutes
:6.5h [4       --> update time to last trading day in the fourth window
:5dm  $x       --> update time to last 5 days minute-averaged and update stock
                   to X
```

#### `%` technical-indicator prefix
> _iex paid subscribers only_  

Typing `%` followed immediately by the abbreviated name of the technical
indicator will overlay the active chart window with the technical indicator.
This will only apply to chart windows.  
**valid technical indicators** include `bbands, wma, ema, hma`. See [full
list](./src/util/technicals.json). Can be combined with time, stock and window
prefixes to update multiple values at the same time  
**examples**
```bash
%bbands         --> add bollinger bands overlay to current active chart
[4 $qqq %wma    --> update fourth window with weighted moving average and $qqq
%               --> % by itself with no indicator name will remove any
                    indicator from the targeted window
```

#### `!` news command
Typing `!` brings up the news display with the latest 20 results relevant to
the active symbol. Use mouse to scroll the table. Use `tab` or `esc` to return
to repl. Can be combined with stock prefix to update multiple values at the
same time  
![news display for iexcli](img/news.png)  
**examples**
```bash
$de !          # show news and update active stock to DE
! $ibm [3      # show news and update stock to ibm in window 3
```

#### `=` watchlist command
Typing `=` brings up the watchlist display. Use mouse to scroll the table. Use
`tab` or `esc` to return to repl.  ![watchlist display for
iexcli](img/watchlist.png).
> note: Key values `open high low close` are only available to iex premium
> data subscribers and during non-market hours to other api consumers  

If the watchlist expands beyond its defined boundaries and is occluding other
components, try rotating through your other components with `tab` or
`Shift-tab`. Alternatively, use the arrow-keys 'right' and then 'left' to
reset the workspace.  
**examples**
```bash
= [4
```

#### `&` profile command
Typing `&` brings up a profile of the active symbol in the targeted window.
Use mouse to scroll components.
![profile display](img/profile.png)  
**examples**
```bash
$qcom &
```

#### `*` list command
Typing `*` brings up a list of gainers/losers/active/etc in the targeted
window. List can be customized in `config.json`.
**examples**
```bash
*
```

#### `"` quote command
Typing `"` displays a real-time quote for the active symbol in the targeted
window.  
**examples**
```bash
[4 " $r
```

## trading
**⚠ disclaimer: iexcli's trading integration is in early _alpha_ and it is not
recommended to use for real money accounts.** Per the [LICENSE](./LICENSE),
neither hp4k1h5, nor iexcli makes any guarantees or claims regarding the
status of trades executed via iexcli. Please consult a financial professional
before deciding whether to use iexcli for live, real-money trading. While
trading integration is in development, it is recommended to only use "paper"
accounts with no real-money value, although the user is free to make their own
judgement.

### setup
You will need an [alpaca trading account](https://app.alpaca.markets/signup).
Accounts are free as are trades. After signing up you can generate real or
paper api keys. Use these to set env vars or `config.json` values as follows:
```bash
export APCA_API_KEY_ID="YourAlpacaAPIid"
export APCA_API_SECRET_KEY="YourAlpacaSecretKey"
```
or
```json
{
  "APCA_API_KEY_ID": "YourAlpacaAPIid",
  "APCA_API_SECRET_KEY": "YourAlpacaSecretKey"
}
```

Though it is not recommended, you can set `config.json` value
`"alpacaAccountType"` to "live" if you wish to trade real-money with iexcli.
The default value is "paper"

## account
if you have entered your information correctly, you should be able to display
your account and positions info by typing `@`.

### placing orders
While algo/robo trading is in development, users can execute manual trades as
follows. All orders must have three components:
1) order **side** buy or sell
    - use the `+` buy-prefix to buy. use the `-` sell-prefix to sell.
    - selling when you own no shares will be considered a short sale.
2) **quantity**
    - affix the quantity directly to the order side
3) stock **symbol**
    - use the stock symbol prefix `$` to designate the instrument  

**examples**
```bash
+100 $tm     -> buy 100 shares of $tm
-50 $qqq     -> sell (short or close) 50 shares of $qqq
```


## thanks
- this project would not have been possible were it not for the incredible
efforts of [blessed](https://github.com/chjj/blessed) and
[blessed-contrib](https://github.com/yaronn/blessed-contrib) authors and
contributors. Though these repos are somewhat dormant and iexcli is using
forked versions, my heartfelt thanks go to these teams.

- stock search is brought to you by
  [fuzzysort](https://github.com/farzher/fuzzysort)

- [iex](https://iexcloud.io) for making a robust free market data api

- [alpaca](https://app.alpaca.markets), for their free trading api
