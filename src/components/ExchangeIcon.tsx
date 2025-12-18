import { TbBrandBinance, TbBrandCoinbase } from 'react-icons/tb';
import type { Exchange } from 'types';
import Kraken from '../../public/kraken-logo.svg?react';

const size = 12;

const CbIcon = () => (
	<TbBrandCoinbase
		title="coinbase"
		size={size}
		className="fill-blue-500 stroke-blue-500 stroke-1"
	/>
);
const BiIcon = () => (
	<TbBrandBinance
		title="binance.us"
		size={size}
		className="fill-yellow-500 stroke-yellow-500 stroke-1"
	/>
);
const KrIcon = () => (
	<Kraken
		title="binance.us"
		className="size-4 fill-yellow-500 stroke-yellow-500 stroke-1"
	/>
);

export const ExchangeIcon = ({ name }: { name: Exchange }) => {
	if (name === 'coinbase') return <CbIcon />;
	if (name === 'binance') return <BiIcon />;
	if (name === 'kraken') return <KrIcon />;

	return <CbIcon />;
};
