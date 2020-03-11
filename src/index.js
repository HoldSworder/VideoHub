import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './router/index';

import { Provider } from 'react-redux'
import store from './store'

const App = (
  <Provider store = {store}>
    <Main />
  </Provider>
)

ReactDOM.render(App, document.getElementById('root'));
