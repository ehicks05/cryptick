import { TbBrandBinance, TbBrandCoinbase } from 'react-icons/tb';
import type { Exchange } from 'types';
import Kraken from '../../assets/kraken-logo.svg?react';
import Kraken2 from '../../assets/kraken-logo-2.svg?react';

const CbIcon = () => (
	<TbBrandCoinbase
		title="coinbase"
		className="w-full h-full fill-blue-500 stroke-blue-500 stroke-1"
	/>
);
const BiIcon = () => (
	<TbBrandBinance
		title="binance.us"
		className="w-full h-full fill-yellow-500 stroke-yellow-500 stroke-1"
	/>
);
const KrIcon = () => <Kraken title="kraken" className="w-full h-full" />;
const KrIconAlt = () => (
	<Kraken2 title="kraken" className="w-full h-full fill-violet-500 stroke-1" />
);

const EXCHANGE_ICONS = {
	coinbase: CbIcon,
	binance: BiIcon,
	kraken: KrIcon,
	krakenAlt: KrIconAlt,
} as const;

export const ExchangeIcon = ({ name }: { name: Exchange; size?: number }) => {
	const Icon = EXCHANGE_ICONS[name];

	return <Icon />;
};
