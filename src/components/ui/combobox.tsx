'use client';

import { Button } from 'components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from 'components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { cn } from 'lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface Props {
	items: { label: string; value: string }[];
	selectedItems: string[];
	onSelect: (value: string) => void;
}

export function ComboboxDemo({ items, selectedItems, onSelect }: Props) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover modal open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{/** biome-ignore lint/a11y/useSemanticElements: <yo> */}
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					Select product...
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search product..." />
					<CommandList>
						<CommandEmpty>No product found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										onSelect(currentValue);
									}}
									className={
										selectedItems.includes(item.value)
											? 'text-green-600 data-[selected=true]:text-green-600'
											: ''
									}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											selectedItems.includes(item.value)
												? 'opacity-100'
												: 'opacity-0',
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
