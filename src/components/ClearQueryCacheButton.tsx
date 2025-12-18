import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';

export const ClearQueryCacheButton = () => {
	const queryClient = useQueryClient();

	return (
		<div>
			<Button
				type="button"
				variant="destructive"
				className="inline-flex"
				onClick={() => queryClient.clear()}
			>
				Clear Query Cache
			</Button>
		</div>
	);
};
