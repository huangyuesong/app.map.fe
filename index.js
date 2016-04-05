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
import MapView from './src/modules/MapView';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}/>
    <Route path="/Map" component={MapView}/>
  </Router>
), document.getElementById('app'));
