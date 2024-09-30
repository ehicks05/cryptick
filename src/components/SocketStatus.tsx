import { useTicker } from '../api';

export const SocketStatus = ({ showLabel = false }: { showLabel?: boolean }) => {
	const { socketStatus } = useTicker();

	return (
		<div title={socketStatus.name} className="flex items-center justify-center">
			<div className="flex items-center justify-center h-4 w-4">
				<div className={`rounded-full h-2 w-2 ${socketStatus.class.bg}`} />
			</div>
			{showLabel && (
				<div className={`text-xs sm:text-base ${socketStatus.class.text}`}>
					{socketStatus.name.toLocaleLowerCase()}
				</div>
			)}
		</div>
	);
};
