import React from 'react';
import { useParams } from 'react-router';
import { useMeasure, useMedia } from 'react-use';
import History from './History';
import TradingViewWidget from './TradingViewWidget';

const ProductDetail = () => {
	const { productId } = useParams();
	const [ref, { height }] = useMeasure<HTMLDivElement>();

	const isDark = useMedia('(prefers-color-scheme: dark)');
	const theme = isDark ? 'dark' : 'light';

	if (!productId) return <div>productId is missing...</div>;
	const symbol = `COINBASE:${productId.replace('-', '')}`;

	return (
		<div ref={ref} className="h-full flex-grow flex flex-col md:flex-row gap-4 p-4">
			<div className="flex flex-grow">
				<TradingViewWidget symbol={symbol} theme={theme} />
			</div>
			<div
				className="hidden md:block overflow-y-hidden h-full"
				style={{ maxHeight: height }}
			>
				<History productId={productId} />
			</div>
		</div>
	);
};

export default React.memo(ProductDetail);
