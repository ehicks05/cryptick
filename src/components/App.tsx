import { useBinanceTicker } from 'services/binance/useBinanceTicker';
import { useCoinbaseTicker } from 'services/cbp';
import ErrorBoundary from './ErrorBoundary';
import { Routes } from './Routes';
import { Footer, Header } from './Shell';

export function App() {
	useCoinbaseTicker();
	useBinanceTicker();

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
