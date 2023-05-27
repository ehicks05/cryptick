## Crypto Price Ticker

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
