import type { CryptickProduct } from 'types';
import { client } from './client';
import { throttle } from './throttle';
import type { AssetPair, AssetPairsResponse, AssetsResponse } from './types';

const toCryptickProduct = ([id, assetPair]: [
	id: string,
	assetPair: AssetPair,
]): CryptickProduct => {
	return {
		id: `kraken:${id}`,
		displayName: id,
		exchange: 'kraken',
		baseAsset: assetPair.base,
		quoteAsset: assetPair.quote,
		minBaseDigits: assetPair.cost_decimals,
		minQuoteDigits: assetPair.pair_decimals,
	};
};

const _assetInfo = async () => {
	const [_assetsResponse, _assetPairsResponse] = await Promise.all([
		client({ path: '/Assets' }),
		client({ path: '/AssetPairs' }),
	]);
	const assetsResponse: AssetsResponse = await _assetsResponse.json();
	const assetPairsResponse: AssetPairsResponse = await _assetPairsResponse.json();

	const { results: _assets } = assetsResponse;
	const { results: _assetPairs } = assetPairsResponse;

	const assets = Object.entries(_assets)
		.filter(([, asset]) => asset.status === 'enabled')
		.map(([id]) => ({ id, displayName: id }));

	const assetPairs = Object.entries(_assetPairs)
		.filter(([, assetPair]) => assetPair.status === 'online')
		.map(toCryptickProduct);

	return {
		assets,
		assetPairs,
	};
};

export const getAssetInfo = throttle(_assetInfo);
