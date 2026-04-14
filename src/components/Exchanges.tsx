import { useQuery } from '@tanstack/react-query';
import ccxt, { type Exchange } from 'ccxt';

const ExchangeInfo = ({ exchange }: { exchange: Exchange }) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['exchangeInfo', exchange.id],
		queryFn: async () => {
			return {
				currencies: exchange.currencies,
				markets: exchange.markets,
				ohlcv: await exchange.fetchOHLCV('BTC/USD', '15m'),
				ticker: await exchange.fetchTicker('BTC/USD'),
			};
		},
	});

	if (error) return error.message;
	if (isLoading) return 'loading...';
	const { currencies, markets, ohlcv, ticker } = data || {};

	return (
		<div>
			<img alt="logo" src={exchange?.urls?.logo} />
			<pre className="text-xs whitespace-pre-wrap">
				{JSON.stringify(
					{
						name: exchange?.name,
						timeframes: Object.keys(exchange?.timeframes).join(', '),
						rateLimit: exchange?.rateLimit,
					},
					null,
					2,
				)}
			</pre>
			ohlcv:
			<pre className="text-xs">{JSON.stringify(ohlcv?.length, null, 2)}</pre>
			<pre className="text-xs">{JSON.stringify(ohlcv?.[0], null, 2)}</pre>
			ticker:
			<pre className="text-xs">{JSON.stringify(ticker, null, 2)}</pre>
			Currency:
			<pre className="text-xs">{JSON.stringify(currencies?.['BTC'], null, 2)}</pre>
			Market:
			<pre className="text-xs">{JSON.stringify(markets?.['BTC/USD'], null, 2)}</pre>
		</div>
	);
};

export const Exchanges = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['exchanges'],
		queryFn: async () => {
			const coinbase = new ccxt.coinbase();
			await coinbase.loadMarkets();

			const kraken = new ccxt.kraken();
			await kraken.loadMarkets();

			const binanceus = new ccxt.binanceus();
			await binanceus.loadMarkets();

			return { exchanges: [coinbase, kraken, binanceus] };
		},
	});

	if (error) return error.message;
	if (isLoading) return 'loading...';
	const { exchanges } = data || {};

	return (
		<div className="grid grid-cols-3">
			{exchanges?.map((exchange) => {
				return <ExchangeInfo key={exchange.id} exchange={exchange} />;
			})}
		</div>
	);
};
