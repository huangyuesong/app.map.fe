import React, {
	Component,
} from 'react';

import '../styles/Management.scss';

import ListView from 'listview-react';

import 'amazeui-touch/dist/amazeui.touch.min.css';

import {
	Tabs,
} from 'amazeui-touch';

export default class Management extends Component {

	constructor (props) {
		super(props);

		this.state = {
			
		};
	}

	_renderSiteList (item, idx) {
		return (
			<div>
				
			</div>
		);
	}

	_renderMacRoomList (item, idx) {
		return (
			<div>
				
			</div>
		);
	}

	render () {
		return (
			<div className="management-page">
				
			</div>
		);
	}
}
