import { ExchangeIcon } from 'components/Products/ExchangeIcon';
import { CircleCheck, CirclePlus } from 'lucide-react';

export interface Announcement {
	id: number;
	date: Date;
	text: React.ReactNode;
	Icon: React.ReactNode;
}

export const ANNOUNCEMENTS: Announcement[] = [
	{
		id: 2,
		date: new Date(2025, 11, 18),
		text: (
			<div className="flex items-center gap-2">
				Added support for Binance US.
				<div className="scale-150">
					<ExchangeIcon name="binance" />
				</div>
			</div>
		),
		Icon: <CircleCheck className="text-green-500" />,
	},
	{
		id: 1,
		date: new Date(2025, 11, 17),
		text: 'Testing the announcements feature!',
		Icon: <CirclePlus className="rounded-full text-green-500" />,
	},
];
