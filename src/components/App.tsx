import { useTicker } from 'api';
import { Routes } from './Routes';
import { Footer, Header } from './Shell';

export function App() {
	useTicker();

	return (
		<div className="flex flex-col h-dvh">
			<Header />
			<div className="grow flex flex-col h-full overflow-y-auto">
				<Routes />
			</div>
			<Footer />
		</div>
	);
}
