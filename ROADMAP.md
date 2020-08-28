# ROADMAP

## objectives for the project

- provide interface for terminal users to interact with financial data
- enable framework for developers to create, track and manage
    algorithmic trading robots
- allow traders to integrate high-level technical data processing and
    automated alerts and actions

## current state

Currently the app allows iex api subscribers to query and view a range of
financial information. Also, limited beta testing of trading is enabled.

Alpha release will include an algo-manager that will make it easier to
start/stop/schedule/monitor/adjust algorithmic trading robots.

## alpha release

### v0.0.14
- iex
  - chart types
    - bar (have to make a new drawille component since contrib bar is not made
        for financial data graphing)
    - ohlc (same as above)
- alpaca
  - streaming data

### v0.0.13
- iex
  - message use info
  - sectors/tags
  - update `help`
- alpaca
  - watchlist integration
  - orders
  - portfolio history

---

## beta release

### v0.1.0
- set config options from iexcli repl
- alpaca
  - algo/bot management

---

## backlog

- portfolio management
- stock screener
- markdown analyst reports/news reader
- chart types
  - bar (have to make a new drawille component since contrib bar is not made
      for financial data graphing)
  - ohlc (same as above)

