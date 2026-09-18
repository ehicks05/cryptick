import { Bug } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useExchangeInfo } from '@/services/useExchangeInfo';
import { ClearQueryCacheButton } from './ClearQueryCacheButton';

const Debug = () => {
	const { data } = useExchangeInfo();
	const [_filter, setFilter] = useLocalStorage('filter', '');
	const filter = _filter.toLowerCase();

	const filteredData = {
		currencies: Object.values(data?.currencies || {}).filter(
			(currency) =>
				currency.id.toLowerCase().includes(filter) ||
				currency.displayName.toLowerCase().includes(filter),
		),
		products: Object.values(data?.products || {}).filter(
			(product) =>
				product.id.toLowerCase().includes(filter) ||
				product.displayName.toLowerCase().includes(filter) ||
				product.baseAsset.toLowerCase().includes(filter) ||
				product.quoteAsset.toLowerCase().includes(filter) ||
				(product.wsName?.toLowerCase() || '').includes(filter),
		),
	};

	return (
		<div className="flex flex-col items-start gap-8 overflow-y-auto">
			<Input
				type="text"
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
			/>
			<pre className="text-xs h-96 overflow-auto">
				<code>{JSON.stringify(filteredData, null, 2)}</code>
			</pre>

			<ClearQueryCacheButton />
		</div>
	);
};

export const DebugDialog = () => {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="icon">
						<Bug />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Debug</DialogTitle>
				</DialogHeader>
				<Debug />
				<DialogFooter>
					<DialogClose render={<Button variant="outline">Close</Button>} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
