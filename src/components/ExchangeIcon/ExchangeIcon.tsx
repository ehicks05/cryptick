import Coinbase from '@/assets/coinbase-logo.svg?react';
import Kraken from '@/assets/kraken-logo.svg?react';
import type { Exchange } from '@/types';

const CbIcon = () => <Coinbase title="coinbase" className="w-full h-full" />;
const KrIcon = () => <Kraken title="kraken" className="w-full h-full" />;

const EXCHANGE_ICONS = {
	coinbase: CbIcon,
	kraken: KrIcon,
} as const;

export const ExchangeIcon = ({ name }: { name: Exchange; size?: number }) => {
	const Icon = EXCHANGE_ICONS[name];

	return <Icon />;
};
