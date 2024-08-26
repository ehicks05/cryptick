import React from 'react';
import { useParams } from 'react-router';
import { useMediaQuery } from '@uidotdev/usehooks';
import History from './History';
import TradingViewWidget from './TradingViewWidget';

const ProductDetail = () => {
	const { productId } = useParams();

	const isDark = useMediaQuery('(prefers-color-scheme: dark)');
	const theme = isDark ? 'dark' : 'light';

	if (!productId) return <div>productId is missing...</div>;
	const symbol = `COINBASE:${productId.replace('-', '')}`;

	return (
		<div className="h-full flex-grow flex flex-col md:flex-row gap-4 p-4">
			<div className="flex flex-grow">
				<TradingViewWidget symbol={symbol} theme={theme} />
			</div>
			<div className="hidden md:block overflow-y-hidden h-full">
				<History productId={productId} />
			</div>
		</div>
	);
};

export default React.memo(ProductDetail);
