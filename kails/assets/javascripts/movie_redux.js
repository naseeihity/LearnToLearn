import React,{ Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MovieBox from './components/MoviesRedux/index';
import MoviesApp from './components/MoviesRedux/reducers/index';

let store = createStore(MoviesApp);

render(
  <Provider store={store}>
  	<MovieBox />
  </Provider>,
  document.getElementById('demo')
);
