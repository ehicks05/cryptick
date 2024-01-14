import React from 'react';
import { Rings } from 'react-loader-spinner';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataFetcher from './DataFetcher';
import { Footer, Header, ProductDetail, Products, Settings } from './components';
import { useHandleVisibility, useProductIds } from 'hooks';
import { useTicker } from 'api';

function App() {
	// useHandleVisibility();
	const [productIds] = useProductIds();
	const { prices } = useTicker();
	const isLoading = !productIds.every((productId) => !!prices[productId]?.price);

	return (
		<Router>
			<DataFetcher />
			{isLoading ? (
				<div className="flex items-center justify-center h-screen">
					<Rings color="#00BFFF" height={256} width={256} />
				</div>
			) : (
				<div className="flex flex-col h-screen">
					<Header />
					<Settings />
					<div className="flex-grow flex flex-col h-full overflow-y-auto">
						<Routes>
							<Route path="/:productId" element={<ProductDetail />} />
							<Route path="/" element={<Products />} />
						</Routes>
					</div>
					<Footer />
				</div>
			)}
		</Router>
	);
}

export default App;
