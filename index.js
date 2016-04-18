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

import './src/styles/_normalize.scss';

import Login from './src/modules/Login';
import MapView from './src/modules/MapView';
import Management from './src/modules/Management';

render((
  	<Router history={browserHistory}>
  		<Route path="/" component={Login} />
  		<Route path="/Map" component={MapView} />
  		<Route path='/Management' component={Management} />
  	</Router>
), document.getElementById('app'));
