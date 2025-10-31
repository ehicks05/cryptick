import { Route, Switch } from 'wouter';
import ProductDetail from './ProductDetail/ProductDetail';
import Products from './Products/Products';

export const Routes = () => (
	<Switch>
		<Route path="/:productId" component={ProductDetail} />
		<Route path="/" component={Products} />
	</Switch>
);
