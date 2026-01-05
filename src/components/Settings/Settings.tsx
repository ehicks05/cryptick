import { SettingsIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { ChartHeightPicker } from './ChartHeightPicker';
import { ProductPicker } from './ProductPicker';

const Settings = () => (
	<div className="flex flex-col items-start gap-8 overflow-y-auto">
		<div>
			<DialogTitle>Settings</DialogTitle>
			<DialogDescription>Adjust your settings here</DialogDescription>
		</div>

		<ProductPicker />
		<ChartHeightPicker />

		<DialogClose asChild>
			<Button variant="secondary">Close</Button>
		</DialogClose>
	</div>
);

export const SettingsDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<SettingsIcon />
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
