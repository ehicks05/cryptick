import { ExchangeIcon } from 'components/ExchangeIcon';
import { Button } from 'components/ui/button';
import { cn } from 'lib/utils';
import { ReadyState } from 'react-use-websocket';
import type { Exchange } from 'types';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { useSocketStatus } from './useSocketStatus';

const SocketStatusButton = ({ exchange }: { exchange: Exchange | 'all' }) => {
	const { [exchange]: socketStatus } = useSocketStatus();

	return (
		<div
			title={socketStatus.name}
			className="flex items-center justify-center w-9 h-9 border rounded-md"
		>
			<div className="flex items-center justify-center h-4 w-4">
				<div
					className={cn('rounded-full h-2 w-2', socketStatus.class.bg, {
						'animate-pulse': [ReadyState.CONNECTING, ReadyState.CLOSING].includes(
							socketStatus.code,
						),
					})}
				/>
			</div>
		</div>
	);
};

const SocketStatus = () => {
	const EXCHANGES = ['coinbase', 'binance', 'kraken'] as const;

	return (
		<div className="flex flex-col items-start gap-2 overflow-y-auto">
			<div>
				<DialogTitle>Socket Status</DialogTitle>
				<DialogDescription>hmm...</DialogDescription>
			</div>

			{EXCHANGES.map((exchange) => (
				<div key={exchange} className="flex items-center gap-2">
					<div className="size-6">
						<ExchangeIcon name={exchange} />
					</div>
					<SocketStatusButton exchange={exchange} />
				</div>
			))}

			<DialogClose asChild>
				<Button variant="secondary">Close</Button>
			</DialogClose>
		</div>
	);
};

export const SocketStatusDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<SocketStatusButton exchange="all" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div>
					<SocketStatus />
				</div>
			</DialogContent>
		</Dialog>
	);
};
