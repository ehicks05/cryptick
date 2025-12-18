import { useChartHeight } from 'hooks/useStorage';
import React from 'react';
import { Link } from 'wouter';
import { useChartData } from './useChart';

interface Props {
	productId: string;
}

const Chart = ({ productId }: Props) => {
	const { chartHeight } = useChartHeight();
	const { points, strokeColor, ref, height, width } = useChartData({
		productId,
	});

	return (
		<Link to={`/${productId}`}>
			<div className={chartHeight} ref={ref}>
				<div className="w-full h-full">
					<svg
						width="100%"
						height="100%"
						className="group"
						// add space all around to prevent points on the edge from being
						// clipped, potentially from the stroke width.
						viewBox={`-3 -3 ${width + 6} ${height + 6}`}
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
			</div>
		</Link>
	);
};

export default React.memo(Chart);
