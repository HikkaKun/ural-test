import { Provider } from 'react-redux';
import GoodsPage from './components/GoodsPage'
import { store } from './store/store';
import Header from './components/Header';

function App() {
  return (
    <Provider store={store}>
      <Header />
      <GoodsPage />
    </Provider>
  )
}

export default App;
