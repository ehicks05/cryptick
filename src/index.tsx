import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
});

const persister = createSyncStoragePersister({
	storage: window.localStorage,
	key: 'CRYPTO_TICKER_REACT_QUERY_OFFLINE_CACHE',
});

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(
	<StrictMode>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
		>
			<App />
		</PersistQueryClientProvider>
	</StrictMode>,
);
