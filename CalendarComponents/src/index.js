import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from './components/Main';
import Head from './components/Header'


ReactDOM.render(<Head />, document.getElementById('header'));
ReactDOM.render(<Calendar />, document.getElementById('calendar'));

