import { ClearQueryCacheButton } from 'components/ClearQueryCacheButton';
import { Bug } from 'lucide-react';
import { useExchangeInfo } from 'services/useExchangeInfo';
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

	return (
		<div className="flex flex-col items-start gap-8 overflow-y-auto">
			<div>
				<DialogTitle>Debug</DialogTitle>
				<DialogDescription>hmm...</DialogDescription>
			</div>

			<pre className='text-xs h-96 overflow-auto'>
				<code>{JSON.stringify(data, null, 2)}</code>
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
