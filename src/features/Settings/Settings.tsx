import { SettingsIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog';
import { ChartHeightPicker } from './ChartHeightPicker';

// import { ProductPicker } from './ProductPicker';

const Settings = () => (
	<div className="flex flex-col items-start gap-8 overflow-y-auto">
		{/*<ProductPicker />*/}
		<ChartHeightPicker />
	</div>
);

export const SettingsDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger
				render={
					<Button variant="outline" size="icon">
						<SettingsIcon />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Adjust your settings here</DialogDescription>
				</DialogHeader>
				<Settings />

				<DialogFooter>
					<DialogClose render={<Button variant="secondary">Close</Button>} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
