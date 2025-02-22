import { useChartHeight } from 'hooks/useChartHeight';
import React from 'react';
import { Link, useSearch } from 'wouter';
import { Debug } from './Debug';
import { useChartData } from './useChart';

const Chart = ({
	productId,
	isDebug = false,
}: { productId: string; isDebug?: boolean }) => {
	const [chartHeight] = useChartHeight();
	const {
		points,
		strokeColor,
		debug,
		ref,
		height,
		width,
		idealCandleWidth,
		setIdealCandleWidth,
	} = useChartData({ productId, isDebug });

	return (
		<div className={chartHeight} ref={ref}>
			<div className="w-full h-full">
				<svg
					width="100%"
					height="100%"
					className="group"
					// add 1 unit all around to prevent points on the edge from being
					// clipped, potentially from the stroke width.
					viewBox={`-1 -1 ${width + 2} ${height + 2}`}
					preserveAspectRatio="none"
				>
					<title>Chart</title>
					<polyline
						strokeLinejoin="round"
						className={`${strokeColor} stroke-[1.5] fill-none group-hover:stroke-2 transition-all`}
						points={points}
					/>
				</svg>
			</div>

			{isDebug && (
				<Debug
					idealCandleWidth={idealCandleWidth}
					setIdealCandleWidth={setIdealCandleWidth}
					debug={JSON.stringify(debug, null, 2)}
				/>
			)}
		</div>
	);
};

const DebugWrapper = ({ productId }: { productId: string }) => {
	const search = useSearch();
	const debug = search.includes('debug=true');

	return debug ? (
		<Chart productId={productId} isDebug />
	) : (
		<Link to={`/${productId}`}>
			<Chart productId={productId} />
		</Link>
	);
};

export default React.memo(DebugWrapper);
