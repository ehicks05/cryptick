import React from 'react';
import { Performances } from './Performances';
import { ProductSummary } from './ProductSummary';
import Chart from './SimpleChart/Chart';

interface Props {
	productId: string;
}

const Product = ({ productId }: Props) => (
	<div className="rounded-lg shadow-xs bg-white dark:bg-linear-to-br dark:from-neutral-900 dark:to-neutral-950">
		<ProductSummary productId={productId} />
		<Chart productId={productId} />
		<Performances productId={productId} />
	</div>
);

export default React.memo(Product);
