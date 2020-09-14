# ROADMAP

## objectives for the project

- provide interface for terminal users to interact with financial data
- enable framework for developers to create, track and manage
    algorithmic trading robots
- allow traders to integrate high-level technical data processing and
    automated alerts and actions

## current state

Currently the app allows iex api subscribers to query and view a range of
financial information. Also, limited beta testing of trading is enabled through
alpaca.

There are numerous known bugs and undesirable behaviors, see
[BUGS](.github/ISSUE_TEMPLATES/bug_reports.md). Many are only fixable through
blessed and/or blessed-contrib fixes. This project is using forked versions
that mainly address bugs encountered and missing functionalities. These bugs
require a bit more investment in time since it's not a project I am familiar
with outside of this endeavor. Nevertheless I am very happy with the tools
available through the blessed & co. libs and will continue to use and develop
on the locally forked versions.

## beta release

v0.1.1
- 📜 bot logger
- 🦙 alpaca account activities tracker
- 🏫 tutorial, better docs

v0.1.2
- streaming data
- charts
  - more types
  - bot charts
    - profit/loss
    - the currently trading stock
- pcap reader

---

## backlog

- set config options from agora repl
- portfolio management
- stock screener
- markdown analyst reports/news reader
- iex
  - chart types
    - bar (have to make a new drawille component since contrib bar is not made
        for financial data graphing)
    - ohlc (same as above)
