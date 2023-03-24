## Crypto Price Ticker

Display price of Bitcoin and other cryptos from the coinbase pro api. Includes live-updating charts!

[crypto.ehicks.net](https://crypto.ehicks.net)

### Setup

1. Install node
2. run `npm i && npm run start`

### data notes

data from cbpro includes:

1. currencies and products - fetched once on pageload
2. 24-stats and candles - fetched every minute
3. ticker data - streams in constantly
