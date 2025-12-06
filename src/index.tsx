import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from 'components/Theme/ThemeProvider';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { APP } from './constants';
import './index.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
});

const persister = createAsyncStoragePersister({
	storage: window.localStorage,
	key: `${APP.NAME}-react_query_offline_cache`,
});

const persistOptions = {
	persister,
	maxAge: 1000 * 60 * 60 * 24,
	buster: __COMMIT_HASH__,
};

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(
	<StrictMode>
		<PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<App />
			</ThemeProvider>
		</PersistQueryClientProvider>
	</StrictMode>,
);
