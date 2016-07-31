import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import MovieBox from './components/Movies/index';

let DATA = require('./components/Movies/ConstValue');

var data = DATA.DATA;

ReactDOM.render(
  <MovieBox data={data}/>,
  document.getElementById('demo')
);
