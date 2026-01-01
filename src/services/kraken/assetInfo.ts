import type { CryptickCurrency, CryptickProduct } from 'types';
import { client } from './client';
import { throttle } from './throttle';
import type { Asset, AssetPair, AssetPairsResponse, AssetsResponse } from './types';

const toCryptickCurrency = ([id]: [id: string, value: Asset]): CryptickCurrency => {
	return { id, displayName: id };
};

const toCryptickProduct = ([id, assetPair]: [
	id: string,
	assetPair: AssetPair,
]): CryptickProduct => {
  
  // deal with kraken naming inconsistencies
	const wsName = assetPair.wsname === 'XBT/USD' ? 'BTC/USD' : assetPair.wsname;

	return {
		id: `kraken:${id}`,
		displayName: id,
		exchange: 'kraken',
		baseAsset: assetPair.base,
		quoteAsset: assetPair.quote,
		minBaseDigits: assetPair.cost_decimals,
		minQuoteDigits: assetPair.pair_decimals,
		wsName,
	};
};

const _assetInfo = async () => {
	const [_assetsResponse, _assetPairsResponse] = await Promise.all([
		client({ path: '/Assets' }),
		client({ path: '/AssetPairs' }),
	]);
	const assetsResponse: AssetsResponse = await _assetsResponse.json();
	const assetPairsResponse: AssetPairsResponse = await _assetPairsResponse.json();

	const { result: _assets } = assetsResponse;
	const { result: _assetPairs } = assetPairsResponse;

	const assets = Object.entries(_assets)
		.filter(([, asset]) => asset.status === 'enabled')
		.map(toCryptickCurrency);

	const assetPairs = Object.entries(_assetPairs)
		.filter(([, assetPair]) => assetPair.status === 'online')
		.map(toCryptickProduct);

	return {
		assets,
		assetPairs,
	};
};

export const getAssetInfo = throttle(_assetInfo);
