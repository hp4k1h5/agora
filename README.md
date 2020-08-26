# iexcli

<span style="display:inline-block; width:50% ">

> view market info and charts and trade stocks in the terminal

</span>

<span style="display:inline-block;top:0;float:right;padding:7px;border:3px #ddd solid">

###### Terms of Service for IEX data

> [Data provided by IEX Cloud](https://iexcloud.io)

</span>

##### !!warning iexcli is in _alpha_ and subject to change ⚠

[contributions](./.github/CONTRIBUTING.md) and [bug
reports](https://github.com/HP4k1h5/iexcli/issues/new?assignees=HP4k1h5&labels=bug&template=bug_report.md&title=basic)
are _welcome_

![screenshot of a terminal window displaying a stock chart, active
gainers/losers, and stock related news](img/iexcli.png)
> the workspace used to generate this image is defined in
> [docs/example-configs/dense.json](./docs/example-configs/dense.json)

##### table of contents


- [changelog](#changelog)
- **[installation](#installation)**
- **[usage](#usage)**
  - [getting started](#getting-started)
  - [**workspaces**, focus and windows](#workspaces,-focus-and-windows)
  - [**commands**](#commands)
- [trading](#trading)
- [**config.json**](#config\.json)
- [thanks!](#thanks)

## CHANGELOG

## v0.0.12
- 📖 config.json documentation. README updates
- 🐛 bugfix. windows are more persistent now within workspaces and across
    carousel rotations.
- 🌈 order book component. type `^` or `book` to see an order book for the
    active symbol.
- ⌚ polling now available for all components. Use prefix-command `poll` or
    set config component key `pollMs` to a value greater than 10.

### v0.0.10

- 📺 improved window handling. `[new` keyword opens new windows. `x`
    closes targeted window. `[all` updates all targetable windows.
- ℹ new help component. type `h` or `help`
- `>` better repl focus and front behavior. English keywords for all commands.
- 📉📈 technical indicators. use `%` indicator prefix to
    overlay indicators, such as bollinger bands `%bbands`, weighted move
    average `%wma` and more. currently only a limited subset of iex's
    technical indicators will display correctly. _requires a paid iex
    subscription._ See [technical
    indicator](./README.md#technical-indicator-prefix)
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
      dependencies by running `yarn` in this directory, or `npm i`.
    2) or run `yarn global add @hp4k1h5/iexcli`  OR  `npm i -g @hp4k1h5/iexcli`.

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
    See **[config.json](#config\.json)** for configuration tips and example configs.

#### register

**for a free [iex account](https://iexcloud.io/cloud-login#/register)** and
copy the **publishable** api key. These typically start with `pk`

## usage

### getting started

If you installed globally, you should be able to use the shell alias `iexcli`
from anywhere. If `which iexcli` does not return a path, refresh your
terminal, e.g. `exec zsh` or start a new terminal window after installing so
that the alias can be found. If you still cannot find an alias, try running
`yarn link` from this project directory root. Otherwise, if you downloaded
with git or to a local directory, RUN `node src/index.js` from the root of
this directory, or `yarn run run`.

Most interaction is through the repl emulator input field. It accepts commands
and updates the charts and data windows. If a component has more data than
fits on the screen, try scrolling it with the mouse. Arrow keys
<kbd>left</kbd> and <kbd>right</kbd> can be used to switch workspaces. See
[configuring workspaces](#configuring-workspaces)

Type `help` or `h` for general information. Type e.g. `h $` or `h :` for
command-specific help. If your terminal allows it, you can scroll through the
help.

#### note about iex message usage

> if you receive <span style="color:red">"Payment required"</span> error
> messages, this is iexcloud telling
you that your remaining message allotment is insufficient for the data request
you are making. You can visit your [iexcloud
console](https://iexcloud.io/console/usage) for more information. If you wish
to make the most use of your 500,000 free monthly iex messages, avoid longer
time-range graph queries. For example a 5-year chart costs roughly 12,590
messages (~252 trading days * 50 messages/day). Intraday time ranges such as
`:1d` or `:100min` are free. Profile (`&`) data is also relatively expensive.

### workspaces, focus and windows

By default, iexcli comes with several workspaces that you can cycle through
with left and right arrow keys. If a component is acting up or the workspace
is erroring, try switching to another workspace and then back.

If the input field is not focused, you can use `tab` and `Shift-tab` to
rotate through components. To return directly to repl hit `>`, the
"greater-than" sign. To leave the repl input and return to focus rotation hit
`esc`.

Unless a window prefix-command, `[`, has been entered, the last focused
component will be the one targeted by commands entered into the repl. When you
return to the repl, the last focused component should be highlighted with a
yellow border.

Type `esc` from the repl to re-enter the focus-rotation. It can be confusing
and if you return directly to the repl when you expected to rotate, try going
in the other direction, i.e. `Shift-tab` instead of `tab` or vice-versa.

Every targetable window in iexcli should have a number in the top-left corner
of the window. From the repl you can type a `[` window prefix to target a
specific window with a command. If a window is not visible, try rotating
through components with e.g. `esc tab` or `esc Shift-tab`, until the desired
component is at the front. Use `>` to return directly to repl, and target that
component.

### commands

#### `help` or `h`

Typing `help` or `h` brings up a help menu. If you include another command
name after, command-specific help is returned to the repl. Type `x` in the
repl to close the help menu  
**examples**
```fortran
help $      --> show help for stock prefix command
h :         --> show help for time prefix command
h #         --> show help for chart command
h           --> show general help
```

#### `quit` or `exit`

Typing `quit`, `exit` or `Ctrl-c` will exit the app

#### <kbd>left</kbd>  <kbd>right</kbd> switch workspaces

Use left and right arrow-keys to switch between workspaces. By default,
iexcli comes with several workspaces. Depending on you terminal and trading
preferences, these can be configured in `config.json`. See [configuring
workspaces](#configuring-workspaces)

#### `>` return to repl

If the repl is not focused, hit `>` to return to repl. The last active window
will be the target of the commands entered unless a window prefix-command has
been issued.

#### `esc`

From the repl, hit `esc` to return to the focus rotation.

#### `[` window prefix

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

#### `#` chart command

Typing `#` brings up the price/volume chart display in the targeted window.
You may also set time, stock symbol, and
[technical-indicator](#%-technical-indicator-prefix) by including those
prefix-commands in the query.  
**examples**
```c
# :1dm $t     --> change the active window to a 1 day 5-minutes chart of $t

[2 # %wma     --> change the second window to a chart with
                  weighted-moving-average overlay
```

### `^` book command

Typing `^` or `book` will bring up the order book for the active symbol.  
**examples**
```fortran
$de ^ poll6e4       --> change the symbol in the active window to $de order
                       book and poll every minute
book $aa [3         --> order book for $aa in the third window
```

![rainbow colored order book for $tsla, showing active
polling](./img/book.png)

#### `!` news command

Typing `!` brings up the news display with up to the latest 20 results
relevant to the active symbol. Use mouse to scroll the table. Use `tab` or
`esc` to return to repl. Can be combined with stock prefix to update multiple
values at the same time  
**examples**
```bash
$de !          # show news and update active stock to DE
! $ibm [3      # show news and update stock to ibm in window 3
```

#### `=` watchlist command

Typing `=` brings up the watchlist display. Use mouse to scroll the table. Use
`tab` or `esc` to return to repl.  ![watchlist display for
iexcli](img/multi-chart.png). Watchlist is in the top-left corner. Use mouse
to scroll. This workspace is defined in
[dense.json](./docs/example-configs/dense.json)
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

#### `poll` (interval in milliseconds)

Components can update themselves periodically either by calling `poll`
followed immediately by a number greater than 10, or by setting the `pollMs`
key for the component in `config.json` to a number greater than 10, which
equals 100 requests/s, which is the max allowable by iex's rate limits.
scientific notation (i.e. `poll1e3`) is allowed.

If you poll multiple components at 10 ms intervals, you will quickly exceed
iex's rate limit which is based on ip, and therefore anything lower than 100,
is inadvisable, since you may have multiple polling components at the same
time.

All polls are cleared when switching workstations. For now, you will have to
manually restart them.

Use command `poll` followed immediately by the interval to start or stop a
component polling.  
**examples**
```bash
[3 poll60000              --> poll the 3rd window every 60 seconds
poll [2                   --> stop polling in window 2
[new ^ $aapl poll1000     --> open a new book window with $aapl
                              polling every 1 second
poll6e4 [3                --> poll the 3rd window every minute (60,000
                              milliseconds)
[all poll                 --> STOP all windows from polling
[all poll1000             --> all components poll at 1 second intervals
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

---

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
paper api keys. Use one set of these to set env vars or `config.json` values
as follows:

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
The default value is "paper". If you have entered "live" account keys, you
will need to see the value of `"alpacaAccountType"` to "live" in order for
them to work.

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

---

## config.json

By default iexcli will look for a config in two places on unix/free-bsd
systems. First it will check `~/.config/iexcli/config.json`, and then it will
look in the root directory of this repo, wherever that is installed on your
system. If the path `~/.config/iexcli/` does not exist, you will have to
create it yourself. You can copy this config and adapt for your own purposes.
Please feel free to share handy configurations by submitting an issue or pr.

## configuring workspaces

See [example configurations](./docs/example-configs)

Eventually, i will create a more comprehensive tutorial to configure your
`config.json` workspaces, but the main idea is that each component needs a
`"yxhw"` key representing the starting position of the top-left corner (y,x),
and the height (h) and width (w) of the component. All workspaces are
currently aligned on a 12x12 grid, so components should not be wider or taller
than 12. If you add components that overlap, you can rotate through the
focus-cycle to bring your desired component to the front, and return to repl
directly using `>`, the "greater-than sign". Additionally, targeting your
desired component window with the window-prefix `[`, will bring it the front.

As an example, a workspace with 4 evenly spaced windows like
```boxcar
                    ┏[1━━━━━┓┏[2━━━━━┓
                    ┃    /- ┃┃---    ┃
                    ┃_/\/   ┃┃ ----  ┃
                    ┗━━━━━━━┛┗━━━━━━━┛
                    ┏[3━━━━━┓┏[4━━━━━┓
                    ┃ /--\  ┃┃-: --  ┃
                    ┃ \__/  ┃┃-: ----┃
                    ┗━━━━━━━┛┗━━━━━━━┛
```

would have a `config.json` like the following:

```json
{
  "workspaces": [
    {
      "name": "4 windows",
      "components":[
      {"type": "chart", "yxhw":[0, 0, 6, 6]},
      {"name": "news", "yxhw":[0, 6, 6, 6]},
      {"name": "profile", "yxhw":[6, 0, 6, 6]},
      {"name": "quote", "yxhw":[6, 6, 6, 6]}
      ]
    }
  ]
}
```

Note that not including a repl in a workspace is not ideal at the moment. If
you have "read-only" workspaces, try to avoid using keys other than
<kbd>left</kbd>  <kbd>right</kbd>, as there is a ghost-repl that can catch
focus and disrupt functionality.

I appreciate your patience as the behavior of the app settles and as i work up
some more thorough explanations of the app's behavior.

---

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
