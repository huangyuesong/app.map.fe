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

import Login from './src/modules/Login';
import Map from './src/modules/Map';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/Map" component={Map}/>
  </Router>
), document.getElementById('app'));
