import { useCoinbaseWebsocket } from 'api/useCoinbaseWebsocket';
import { Settings2 } from 'lucide-react';
import { useProducts } from '../api';
import { useProductIds } from '../hooks';
import { buildSubscribeMessage } from '../utils';
import { CandleGranularityPicker } from './CandleGranularityPicker';
import { ChartHeightPicker } from './ChartHeightPicker';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { ComboboxDemo } from './ui/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';

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
					items={items}
					selectedItems={productIds}
					onSelect={(value) => toggleProduct(value)}
				/>
			</div>

			<ChartHeightPicker />

			<CandleGranularityPicker />

			<div className="flex flex-col">
				<div>Theme</div>
				<ThemeToggle />
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
