import { useTicker } from 'api';
import { Route, Switch } from 'wouter';
import { Footer, Header, ProductDetail, Products } from './components';
import ProductDetailOld from './components/ProductDetailOld';

function App() {
	useTicker();

	return (
		<div className="flex flex-col h-dvh">
			<Header />
			<div className="grow flex flex-col h-full overflow-y-auto">
				<Switch>
					<Route path="/:productId" component={ProductDetailOld} />
					<Route path="/:productId/tv" component={ProductDetail} />
					<Route path="/" component={Products} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
}

export default App;
