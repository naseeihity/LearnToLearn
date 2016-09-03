import React from 'react';
import ReactDOM from 'react-dom';
import {IMG_DETAIL} from './assets/javascripts/components/ConstValue';
import Lazyimg from './assets/javascripts/components/Lazyimg';

import 'intersection-observer';
import './assets/stylesheets/index.css';
let images = IMG_DETAIL;

ReactDOM.render(
   <Lazyimg images={images} />, document.getElementById('lazyImg'));

