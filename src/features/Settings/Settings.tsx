import { SettingsIcon } from 'lucide-react';
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
import { ChartHeightPicker } from './ChartHeightPicker';
import { ProductPicker } from './ProductPicker';

const Settings = () => (
	<div className="grid gap-8 max-h-[60vh] overflow-auto w-full">
		<ProductPicker />
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
				</DialogHeader>

				<Settings />

				<DialogFooter>
					<DialogClose render={<Button variant="secondary">Close</Button>} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
