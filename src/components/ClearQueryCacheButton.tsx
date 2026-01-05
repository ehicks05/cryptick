import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';

export const ClearQueryCacheButton = () => {
	const queryClient = useQueryClient();

	const handleClick = () => {
		queryClient.clear();
		location.reload();
	};

	return (
		<div>
			<Button variant="destructive" onClick={handleClick}>
				Clear Query Cache
			</Button>
		</div>
	);
};
