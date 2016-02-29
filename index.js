import React from 'react';

import {
	render,
} from 'react-dom';

import {
	Router,
	Route,
	browserHistory,
} from 'react-router';

import './src/polyfill/index';

import Map from './src/modules/Map';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Map}/>
  </Router>
), document.getElementById('app'));
