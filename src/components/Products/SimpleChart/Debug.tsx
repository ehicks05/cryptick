interface Props {
	idealCandleWidth: number;
	setIdealCandleWidth: React.Dispatch<React.SetStateAction<number>>;
	debug: string;
}

export const Debug = ({ idealCandleWidth, setIdealCandleWidth, debug }: Props) => {
	return (
		<div className="absolute bottom-0">
			<input
				type="range"
				min={1}
				max={7}
				step={0.05}
				value={idealCandleWidth}
				onDoubleClick={() => setIdealCandleWidth(3.5)}
				onChange={(e) => {
					e.preventDefault();
					setIdealCandleWidth(Number(e.target.value));
				}}
			/>
			<pre className="whitespace-pre-wrap text-xs">{debug}</pre>
		</div>
	);
};
