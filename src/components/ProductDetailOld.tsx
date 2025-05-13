import { useMeasure } from '@uidotdev/usehooks';
import React, { useState } from 'react';
import { useParams } from 'wouter';
import { use24HourStats, useCandles } from '../api';
import CandleChart from './CandleChart';
import History from './History';
import ProductSummary from './ProductSummary';

const borderColor = (isPositive: boolean) =>
  isPositive
    ? 'border-green-300 dark:border-green-950'
    : 'border-red-300 dark:border-red-950';

const background = (isPositive: boolean) =>
  `bg-linear-to-t ${
    isPositive ? 'from-[rgba(6,78,59,.15)]' : 'from-[rgba(153,27,27,.15)]'
  } to-transparent`;

const ProductDetail = () => {
  const [ref, { height: _height }] = useMeasure<HTMLDivElement>();
  const height = _height || 0;
  const [innerRef, { height: _innerHeight }] = useMeasure<HTMLDivElement>();
  const innerHeight = _innerHeight || 0;

  const { productId } = useParams();
  const [granularity, setGranularity] = useState(900);
  const { data: _candles } = useCandles([productId || '']);
  const candles = _candles?.[productId || ''];

  const { data: stats } = use24HourStats();
  const productStats = stats?.[productId || ''];

  if (!productId) return <div>ProductId is missing...</div>;
  if (!productStats) return <div>productStats is missing...</div>;
  if (!candles) return <div>candles is missing...</div>;

  const isPositive = productStats.last >= productStats.open;

  const granularityPicker = (
    <select
      className='text-xs dark:bg-black'
      onChange={e => setGranularity(Number(e.target.value))}
      value={granularity}
    >
      {[
        { value: 60, label: '1m' },
        { value: 300, label: '5m' },
        { value: 900, label: '15m' },
        { value: 3600, label: '1h' },
        { value: 21600, label: '6h' },
        { value: 86400, label: '1d' },
      ].map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  return (
    <div ref={ref} className='h-full grow flex flex-col md:flex-row gap-4 p-4'>
      <div
        className={`grow flex flex-col p-4 border rounded ${borderColor(
          isPositive,
        )} ${background(isPositive)}`}
      >
        <div ref={innerRef}>
          <ProductSummary productId={productId} />
        </div>
        <div className='grow'>
          <CandleChart
            height={height - innerHeight}
            candles={candles}
            productId={productId}
          />
        </div>
      </div>
      <div
        className='hidden md:block overflow-y-hidden h-full'
        style={{ maxHeight: height }}
      >
        <History productId={productId} />
      </div>
    </div>
  );
};

export default React.memo(ProductDetail);
