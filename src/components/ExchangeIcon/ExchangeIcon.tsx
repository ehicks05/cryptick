import { TbBrandCoinbase } from 'react-icons/tb';
import type { Exchange } from '@/types';
import Kraken from '../../assets/kraken-logo.svg?react';

const CbIcon = () => (
	<TbBrandCoinbase
		title="coinbase"
		className="w-full h-full fill-blue-500 stroke-blue-500 stroke-1"
	/>
);
const KrIcon = () => <Kraken title="kraken" className="w-full h-full" />;

const EXCHANGE_ICONS = {
	coinbase: CbIcon,
	kraken: KrIcon,
} as const;

export const ExchangeIcon = ({ name }: { name: Exchange; size?: number }) => {
	const Icon = EXCHANGE_ICONS[name];

	return <Icon />;
};
