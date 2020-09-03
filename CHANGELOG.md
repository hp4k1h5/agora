# CHANGELOG

## v0.0.19
- `&` profile fixes. should work with etfs and other non-company symbols again

## v0.0.18
- 🦙 `limit`, `stop` and `stop_limit` order types now accepted. Use
    limit-prefix `<` and stop-prefix `>`. See [trading](./README.md#trading)

## v0.0.17
- 💹 chart improvements, larger, more adherent
- `>` repl fixes/changes. components can no longer be focused at all while
    input fixes are afoot.

## v0.0.16
- log fix

## v0.0.15
- 🐴 alpaca bot integration. Type `bots ls` to see active bots. See [bots
    README](docs/bots/README.md) for more information
- limit orders. Use `<` limit price prefix to set floor on limit orders

## v0.0.14
- 🐛 bugfix for manual trading

## v0.0.13
- 🐴 alpaca watchlist integration. set config.json key "watchlist" to
    "alpaca". for now all watchlists are displayed together
- 🏦 more iex/alpaca account information. alpaca daily/weekly/monthly/yearly
    profit loss charts, orders, iex message use and more. Set env var or
    config val `IEX_SECRET_KEY` to obtain iex account information in the
    account component.
- ℹ updated `help`
- 🐛 bugfixes for sectors, polling, and workspace switch

## v0.0.12
- 📖 config.json documentation. README updates
- 🐛 bugfix. windows are more persistent now within workspaces and across
    carousel rotations.
- 🌈 order book component. type `^` or `book` to see an order book for the
    active symbol.
- ⌚ polling now available for all components. Use prefix-command `poll` or
    set config component key `pollMs` to a value greater than 10.

## v0.0.11
- filepath fixes

## v0.0.10
- 📺 improved window handling. `new` keyword opens new windows. `x`
    closes targeted window. `all` updates all targetable windows.
- ℹ new help component, and improved help menu
- `>` better repl focus and front behavior. English keywords for all commands.
- 📉📈 technical indicators. use `%` indicator prefix to
    overlay indicators, such as bollinger bands `%bbands`, weighted move
    average `%wma` and more. currently only a limited subset of iex's
    technical indicators will display correctly. _requires a paid iex
    subscription._ See [technical indicator](./README.md#technical-indicator)
- 📊 sector performance

## v0.0.9
- alpaca config fixes

## v0.0.8
- 🐛 bugfix for '>' return to repl command in carousel mode
- 🐴 [alpaca](https://alpaca.markets/) integration. Users can now trade with
    alpaca api and see account and positions info. See
    [trading](./README.md/#trading)

## v0.0.7
- bin fix, `iexcli` alias should work again.

## v0.0.6
- 💠 multi-component handling. user can specify as many component windows as
    they wish for any component except repl. See [usage](./README.md#usage)
- 🎠 carousel mode. use left and right arrows to switch workspaces.
- 📜 gainers/losers lists. use `*` command to see list info


## v0.0.5
- npm fix

## v0.0.4
- bin fix

## v0.0.3
- 🔍 fuzzy search for symbols by symbol or company name. thanks to farzher's
   [fuzzysort](https://github.com/farzher/fuzzysort), users can now use `?`
  command to print possible matches. see [](#fuzzysort)
- 💻 new shell alias `iexcli` should run from anywhere, if you have iexcli
     installed globally.

## v0.0.2
- 📖 profile view displays information about the active symbol
- 📔 improved watchlist display and scroll

## v0.0.1
- config.json allows user to set a number of variables. please be careful as
    very few configurations have been tested.
- 📰 news, command `!` will fetch latest 20 news results related to the active
    symbol. can be combined with other prefix commands. work-in-progress
- 📔 watchlist, command `=` will refresh and focus the watchlist.
    work-in-progress
