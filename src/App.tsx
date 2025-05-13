import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useStore from 'store';
import {
  Footer,
  Header,
  ProductDetail,
  Products,
  Settings,
} from './components';
import ProductDetailOld from 'components/ProductDetailOld';

function App() {
  const isShowSettings = useStore(state => state.isShowSettings);

  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <Header />
        {isShowSettings && <Settings />}
        <div className='flex-grow flex flex-col h-full overflow-y-auto'>
          <Routes>
            <Route path='/:productId' element={<ProductDetail />} />
            <Route path='/:productId/old' element={<ProductDetailOld />} />
            <Route path='/' element={<Products />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
