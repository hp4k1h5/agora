# iexcli tutorial

## intro

Welcome to iexcli! This tutorial will take you through a few basic workflows
that you might find helpful when using the app. It may assume a basic
knowledge of financial market terminology. It will frequently reference the
[iex](https://iexcloud.io/docs/api/) and
[alpaca](https://alpaca.markets/docs/api-documentation) api documentations. If
you have any questions, be sure to submit an
[issue](https://github.com/HP4k1h5/iexcli/issues) on github.

## download and install

Please consult the [install section](../README.md#installation) of the README.

## getting started

If you installed globally, you should be able to use the shell alias `iexcli`
from anywhere. If `which iexcli` does not return a path, refresh your
terminal, e.g. `exec zsh` or start a new terminal window after installing so
that the alias can be found. If you still cannot find an alias, try running
`yarn link` from this project directory root. Otherwise, if you downloaded
with git or to a local directory, RUN `node src/index.js` from the root of
this directory, or `yarn run run`.

Most interaction is through the repl emulator input field, if the workspace
has one. To focus the repl, type `>`, the "greater-than" sign. It accepts
commands and updates the charts and data windows. If a component has more data
than fits on the screen, try scrolling it with the mouse if your terminal
allows it. Type <kbd>esc</kbd> to leave the repl.

Arrow keys <kbd>left</kbd> and <kbd>right</kbd> can be used to switch
workspaces. See [configuring workspaces](#configuring-workspaces)

Type `help` or `h` for general information. Type e.g. `h $` or `h :` for
command-specific help. If your terminal allows it, you can scroll through the
help. Type `x` from the repl to close the help window.

## workspaces and components

By default, if you haven't changed the config or added a new one to the
`$HOME/.config/iexcli` dir, iexcli comes with several workspaces that you can
cycle through with <kbd>left</kbd> and <kbd>right</kbd> arrow keys. If a
component is acting up or the workspace is erroring, try switching to another
workspace and then back.

See [configuring workspace](#configuring-workspaces) for more information about
how to configure your `config.json`

## commands

Most interaction in iexcli is through the repl, where the user can enter
command strings and update the components or manage bots or trade. Typically
command words are order-agnostic, though there are some exceptions. This means
that the following two commands are interpreted identically by iexcli.

```bash
$TM quote [1
[1 $tm quote 
```

This command tell iexcli to update the 1st window with a quote component of
\$TM. Try it out. If you are not in the repl and have no cursor, type `>` to
focus the repl. Then type one of the above commands and hit <kbd>enter</kbd>

You should see a real-time quote of \$TM in the 1st window. Note that not all
data is available to all iexcloud api users, please consult the
[iex api guide](https://intercom.help/iexcloud/en/articles/2956164-real-time-and-15-minute-delayed-stock-prices)

Components remember all the inputs provided. In order to change the 1st window
to a quote of \$GM, just type `$GM` and hit <kbd>enter</kbd>. Notice that if
you are targeting the last targeted component, you do not need to reenter the
window-prefix `[`.

To change the component from quote to news, type `news` or `!`, the shortcut
command. This will update the component from quote to news but the stock will
remain the same, and you should have a news view of the stock symbol you
entered.

Most commands in iexcli have a long and short form. See
[commands](../README.md#commands).

Unless a window prefix-command, `[`, has been entered, the last focused
component will be the one targeted by commands entered into the repl. 

Every targetable window in iexcli should have a number in the top-left corner
of the window. From the repl you can type a `[` window prefix to target a
specific window with a command.

You can read more about [commands](../README.md#commands) in the README.

For now let's try some more commands. You can adjust these to your config's
requirements. If, for instance, a command listed below targets a window number
that is not available in your workspace, or is not the right target for the
component you wish to query, change the window-prefix `[`.

Enter any of the following commands to get an overview of the features
available in iexcli.

### market data commands

```bash
[all poll3e4 $de   --> poll all components at 30 second intervals and update
                       all components to $DE

[all poll          --> stop polling in all components

[2 [3 $qqq         --> update windows 2 and 3 to $QQQ

$spy ^ [2          --> update the 2nd window with a book of $spy
" $r              --> update the last focused component with a quote of $R.
                       in this case, that would window 2.

! [3               --> update window 3 with news for the active symbol in the
                       component. in this case that would $QQQ.
```

You'll notice that not all components fit nicely into all workspace windows.
Some components really are not made for certain width/height settings. This is
partly the result of the mono-space terminal environment, and iex's goal of
providing as much useful data in such an environment as possible. Certain
defaults have been set and so forth that may not be amenable to your ideal
workspace at the moment. Development plans include context-aware components
that can resize their content horizontally and vertically based on "yxhw"
settings. See [configuring workspaces](#configuring-workspaces) below.

### trading commands 

Currently all trading functionality in iexcli is done through the [alpaca
trading api](https://alpaca.markets/). If you do not have an alpaca account
none of these commands will work for you. Please see information about getting
a free [alpaca account](../README.md#🦙-alpaca-trading) and setting your api
keys in the README.

```bash
+100 $AA              --> buy 100 shares of $AA

close $aa             --> close your position in $AA

$z -10 <90            --> sell 10 shares of $Z with a limit price of $90

$YYY +1_000 >14.39    --> buy 1,000 shares of $YYY with a stop price of 16.39

cancel $yyy           --> cancel $YYY orders

cancel all            --> cancel all orders

close $Z              --> close out the $Z position
```

These commands demonstrate most of the manual trading functionality currently
available in iexcli. I encourage you to read the [alpaca
account](../README.md#🦙-alpaca-trading) section of the README to learn more.

The other way to trade in iexcli is to build a bot. While a bot tutorial is in
progress, there is a well documented demo bot example available at
[docs/bots/alpha.js](bots/alpha.js), as well as some additional helpful
information in the README.

### configuring workspaces

See [example configurations](docs/example-configs)

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
