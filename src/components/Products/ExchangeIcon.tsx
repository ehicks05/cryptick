import { TbBrandBinance, TbBrandCoinbase } from 'react-icons/tb';

const CbIcon = () => (
	<TbBrandCoinbase size={16} className="fill-blue-500 stroke-blue-500 stroke-1" />
);
const BiIcon = () => (
	<TbBrandBinance size={16} className="fill-yellow-500 stroke-yellow-500 stroke-1" />
);

export type Exchange = 'coinbase' | 'binance';

export const ExchangeIcon = ({ name }: { name: Exchange }) => {
	if (name === 'coinbase') return <CbIcon />;
	if (name === 'binance') return <BiIcon />;

	return <CbIcon />;
};
