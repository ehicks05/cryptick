import ProductDetailOld from 'components/ProductDetailOld';
import useStore from 'store';
import { Route, Switch } from 'wouter';
import { Footer, Header, ProductDetail, Products, Settings } from './components';

function App() {
	const isShowSettings = useStore((state) => state.isShowSettings);

	return (
		<div className="flex flex-col h-screen">
			<Header />
			{isShowSettings && <Settings />}
			<div className="flex-grow flex flex-col h-full overflow-y-auto">
				<Switch>
					<Route path="/:productId" component={ProductDetail} />
					<Route path="/:productId/old" component={ProductDetailOld} />
					<Route path="/" component={Products} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
}

export default App;
