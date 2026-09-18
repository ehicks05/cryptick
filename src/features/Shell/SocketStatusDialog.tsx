import { cn } from 'cn';
import { ReadyState } from 'react-use-websocket';
import { ExchangeIcon } from '@/components/ExchangeIcon';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import type { Exchange } from '@/types';
import { useSocketStatus } from './useSocketStatus';

const SocketStatusDot = ({ exchange }: { exchange: Exchange | 'all' }) => {
	const { [exchange]: socketStatus } = useSocketStatus();

	return (
		<div
			title={socketStatus.name}
			className="flex items-center justify-center w-9 h-9 rounded-md"
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
			{EXCHANGES.map((exchange) => (
				<div key={exchange} className="flex items-center gap-2">
					<div className="size-6">
						<ExchangeIcon name={exchange} />
					</div>
					<SocketStatusDot exchange={exchange} />
				</div>
			))}
		</div>
	);
};

export const SocketStatusDialog = () => {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="icon">
						<SocketStatusDot exchange="all" />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Socket Status</DialogTitle>
					<DialogDescription>hmm...</DialogDescription>
				</DialogHeader>
				<SocketStatus />

				<DialogFooter>
					<DialogClose>
						<Button variant="outline">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
