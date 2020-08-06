# iexcli
> query and view stock charts in the terminal using a
> [blessed](https://github.com/chjj/blessed) interface

#### !!warning unstable and in early development!!
[contributions](./.github/CONTRIBUTING.md) and [bug
reports](https://github.com/HP4k1h5/iexcli/issues/new?assignees=HP4k1h5&labels=bug&template=bug_report.md&title=basic) are _welcome_

![screen shot of iexcli with one price chart, one volume chart, a repl, and
some stock quote data](img/iexcli.png)

##### Terms of Service for IEX data
[Data provided by IEX Cloud](https://iexcloud.io)

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
- or set the IEX_PUB_KEY in config.json  
register for a free [iex account](https://iexcloud.io/cloud-login#/register)
copy the **publishable** api key. These typically start with `pk`  export it
as an environment variable either locally in your shell, or globally in your
`.bashrc`

## usage
RUN `node index.js` from the root of this directory.

All interaction is through the repl emulator in the bottom right corner of the
screen. It accepts commands and updates the charts and data windows. See
examples below.

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
