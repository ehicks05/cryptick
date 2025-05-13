import { use24HourStats } from 'api';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Chart from './Chart';
import ProductSummary from './ProductSummary';

const BORDER_COLORS = {
  POS: 'border-green-50 dark:border-green-950 hover:border-green-200 dark:hover:border-green-900',
  NEG: 'border-red-50 dark:border-red-950 hover:border-red-200 dark:hover:border-red-900',
  UND: 'border-neutral-50 dark:border-neutral-800',
} as const;

const BG_COLORS = {
  POS: 'to-[rgba(6,78,59,.02)] hover:to-[rgba(6,78,59,.08)] from-[rgba(6,78,59,.15)] via-[rgba(6,78,59,.10)] hover:from-[rgba(6,78,59,.25)] hover:via-[rgba(6,78,59,.25)]',
  NEG: 'to-[rgba(153,27,27,.02)] hover:to-[rgba(153,27,27,.08)] from-[rgba(153,27,27,.15)] via-[rgba(153,27,27,.10)] hover:from-[rgba(153,27,27,.25)] hover:via-[rgba(153,27,27,.25)]',
  UND: 'from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950',
} as const;

const Product = ({
  productId,
  handle,
}: {
  productId: string;
  handle: ReactNode;
}) => {
  const { data } = use24HourStats();
  const productStats = data?.[productId];

  const isPositive = productStats ? productStats.isPositive : undefined;
  const colorKey =
    isPositive === undefined ? 'UND' : isPositive ? 'POS' : 'NEG';
  return (
    <div
      className={`p-4 rounded-lg border bg-gradient-to-t ${BORDER_COLORS[colorKey]} ${BG_COLORS[colorKey]}`}
    >
      <div className='flex justify-between'>
        <ProductSummary productId={productId} />
        {handle}
      </div>
      <Link to={`/${productId}`}>
        <Chart productId={productId} />
      </Link>
    </div>
  );
};

export default React.memo(Product);
