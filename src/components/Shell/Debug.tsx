import { ClearQueryCacheButton } from 'components/ClearQueryCacheButton';
import { Bug } from 'lucide-react';
import { useExchangeInfo } from 'services/useExchangeInfo';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

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
			<div>
				<DialogTitle>Debug</DialogTitle>
				<DialogDescription>hmm...</DialogDescription>
			</div>

			<input type='text' className='p-1 bg-neutral-900' value={filter} onChange={(e) => setFilter(e.target.value)} />
			<pre className="text-xs h-96 overflow-auto">
				<code>{JSON.stringify(filteredData, null, 2)}</code>
			</pre>

			<ClearQueryCacheButton />
			<DialogClose asChild>
				<Button variant="secondary">Close</Button>
			</DialogClose>
		</div>
	);
};

export const DebugDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Bug />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div>
					<Debug />
				</div>
			</DialogContent>
		</Dialog>
	);
};
