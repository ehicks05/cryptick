import { useTicker } from 'api';
import { Route, Switch } from 'wouter';
import {
	Footer,
	Header,
	ProductDetail,
	ProductDetailTv,
	Products,
} from './components';

function App() {
	useTicker();

	return (
		<div className="flex flex-col h-dvh">
			<Header />
			<div className="grow flex flex-col h-full overflow-y-auto">
				<Switch>
					<Route path="/:productId" component={ProductDetail} />
					<Route path="/:productId/tv" component={ProductDetailTv} />
					<Route path="/" component={Products} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
}

export default App;
