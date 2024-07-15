import { useState } from 'react';

const myFormat = Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

interface VolumeBarProps {
	getX: (input: number) => number;
	i: number;
	candleWidth: number;
	rectXDivisor: number;
	height: number;
	volumeBarHeight: number;
	volume: number;
}

export const VolumeBar = ({
	getX,
	i,
	candleWidth,
	rectXDivisor,
	height,
	volumeBarHeight,
	volume,
}: VolumeBarProps) => {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<>
			<rect
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				className="text-gray-700 fill-current opacity-40 hover:opacity-60"
				x={getX(i * candleWidth) - candleWidth / rectXDivisor}
				y={height - volumeBarHeight}
				width={candleWidth / (rectXDivisor / 2)}
				height={volumeBarHeight}
			/>
			{isHovered && (
				<text
					fontSize="11"
					className="fill-current"
					x={getX(i * candleWidth) - 20}
					y={height + 25}
				>
					{myFormat.format(volume)}
				</text>
			)}
		</>
	);
};
