import { useCoinbaseWebsocket } from 'api/useCoinbaseWebsocket';
import { Settings2 } from 'lucide-react';
import { useProducts } from '../../api';
import { useProductIds } from '../../hooks';
import { buildSubscribeMessage } from '../../utils';
import { CandleGranularityPicker } from '../CandleGranularityPicker';
import { ExternalLinks } from '../ExternalLinks';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/button';
import { ComboboxDemo } from '../ui/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { ChartHeightPicker } from './ChartHeightPicker';

const Settings = () => {
	const { sendJsonMessage } = useCoinbaseWebsocket();
	const [productIds, setProductIds] = useProductIds();
	const { data: products = {} } = useProducts();

	const toggleProduct = (productId: string) => {
		const isAdding = !productIds.includes(productId);

		const stable = productIds.filter((p) => p !== productId);
		const newProducts = [...stable, ...(isAdding ? [productId] : [])];

		setProductIds(newProducts);
		sendJsonMessage(
			buildSubscribeMessage(isAdding ? 'subscribe' : 'unsubscribe', [productId]),
		);
	};

	const items = Object.values(products).map(({ id, display_name }) => ({
		label: display_name,
		value: id,
	}));

	return (
		<div className="flex flex-col items-start gap-8 overflow-y-auto">
			<div>
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription>Adjust your settings here</DialogDescription>
			</div>

			<div className="flex flex-col">
				<div>Toggle Products</div>
				<ComboboxDemo
					items={items.toSorted((o1, o2) => {
						const o1v = productIds.includes(o1.value) ? -1 : 1;
						const o2v = productIds.includes(o2.value) ? -1 : 1;

						return o1v - o2v;
					})}
					selectedItems={productIds}
					onSelect={(value) => toggleProduct(value)}
				/>
			</div>

			<ChartHeightPicker />

			<div>
				Candle Granularity
				<CandleGranularityPicker />
			</div>

			<div className="flex flex-col">
				<div>Theme</div>
				<ThemeToggle />
			</div>

			<div>
				Links
				<ExternalLinks />
			</div>

			<DialogClose asChild>
				<Button variant="secondary">Close</Button>
			</DialogClose>
		</div>
	);
};

export const SettingsDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Settings2 />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div>
					<Settings />
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Settings;
