# CHANGELOG

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
