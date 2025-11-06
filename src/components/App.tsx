import { useTicker } from 'api';
import ErrorBoundary from './ErrorBoundary';
import { Routes } from './Routes';
import { Footer, Header } from './Shell';

export function App() {
	useTicker();

	return (
		<div className="flex flex-col h-dvh">
			<ErrorBoundary>
				<Header />
				<div className="grow flex flex-col h-full overflow-y-auto p-4 pt-0">
					<Routes />
					<div className="grow" />
					<Footer />
				</div>
			</ErrorBoundary>
		</div>
	);
}
