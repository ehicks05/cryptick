## cryptick

[![Netlify Status](https://api.netlify.com/api/v1/badges/a5cdb7e5-9abd-42a7-946c-b17cfa51284e/deploy-status)](https://app.netlify.com/sites/admiring-jang-089013/deploys)

Display price of Bitcoin and other cryptos from the coinbase pro api. Includes live-updating charts!

[crypto.ehicks.net](https://crypto.ehicks.net)

### Setup

1. Install node
2. run `npm i && npm run dev`

### data notes

data from cbpro includes:

1. currencies and products - fetched once on pageload
2. 24-stats and candles - fetched every minute
3. ticker data - streams in constantly

### todos

1. when hovering over a candle
  - display stats for that candle somewhere
2. drag x
  - when dragging to the past, fetch more candles. note: old candles don't change
3. 1w, 1m candles

### binance api notes

1. Higher rate limits
2. More candle granularities:

CB: 1m, 5m, 15m, 1h, 6h, and 1d

Binance:

| Interval | `interval` value                    |
| -------- | ----------------------------------- |
| seconds  | `1s`                                |
| minutes  | `1m`, `3m`, `5m`, `15m`, `30m`      |
| hours    | `1h`, `2h`, `4h`, `6h`, `8h`, `12h` |
| days     | `1d`, `3d`                          |
| weeks    | `1w`                                |
| months   | `1M`                                |
3. larger candle counts per request

CB: 300
Binance: 1000