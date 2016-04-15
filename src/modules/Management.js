import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/Management.scss';

import Tab from './Tab';

import ListView from 'listview-react';

export default class Management extends Component {

	constructor (props) {
		super(props);

		this.state = {
			loading: true,
			seletedTab: 0,
		};
	}

	_renderSiteList (item, idx) {
		return (
			<div key={idx} className="site-info-row-wrapper">
				<p>{`基站${idx + 1}`}</p>

				<p>{item.longitude}</p>

				<p>{item.latitude}</p>
			</div>
		);
	}

	_renderMacRoomList (item, idx) {
		return (
			<div key={idx} className="mac-room-info-row-wrapper">
				<p>{`机房${idx + 1}`}</p>

				<p>{item.longitude}</p>

				<p>{item.latitude}</p>
			</div>
		);
	}

	_fetchSiteAndMacRoom () {
		// let { energySystemURL } = config;

		// return (
			// fetch(`${energySystemURL}/getSiteInfo_SiteManagementAction`)
			// .then((res)=> {
			// 	return res.json();
			// })
			// .then((json)=> {
			// 	return new Promise((resolve, reject)=> {
			// 		resolve(json);
			// 	});
			// })
			// .catch((err)=> {
			// 	this._errorHandler(err);
			// });
		// );
		let sites = [];
		let macRooms = [];

		for (let i = 0; i < 4000; ++i) {
			sites.push({"area":18.9,"carrierCount":413,"city":"河北石家庄长安区","id":163130,"identityNo":"HB10000580","isFlag":0,"latitude":91.6215,"longitude":52.1477,"name":"基站#580","powerId":183,"powerPrice":0.68,"typeId":216,"useDate":"2011-12-16 00:00:00","wallInfo":"钢铁水泥"});
		}

		for (let i = 0; i < 1000; ++i) {
			macRooms.push({"area":18.9,"carrierCount":413,"city":"河北石家庄长安区","id":163130,"identityNo":"HB10000580","isFlag":0,"latitude":91.6215,"longitude":52.1477,"name":"基站#580","powerId":183,"powerPrice":0.68,"typeId":216,"useDate":"2011-12-16 00:00:00","wallInfo":"钢铁水泥"});
		}
		return new Promise((resolve, reject)=> {
			setTimeout(()=> {
				resolve({
					sites: sites,
					macRooms: macRooms,
				});
			}, 2000);
		});
	}

	componentDidMount () {
		this._fetchSiteAndMacRoom()
		.then((data)=> {
			this.setState({
				loading: false,
				sites: data.sites,
				macRooms: data.macRooms,
			});
		});
	}

	render () {
		let listviewStyle = {
			height: window.innerHeight - 40,
		};

		return (
			<div className="management-page">
				<Tab onSelect={(idx)=> this.setState({seletedTab: idx})} />

				{(()=> {
					if (this.state.loading) {
						return <ListView.Loading className="loading" />;
					} else {
						if (this.state.seletedTab === 0) {
							return (
								<ListView
									style={listviewStyle}
									data={this.state.sites || []}
									renderItem={this._renderSiteList.bind(this)} />
							);
						} else if (this.state.seletedTab === 1) {
							return (
								<ListView
									style={listviewStyle}
									data={this.state.macRooms || []}
									renderItem={this._renderMacRoomList.bind(this)} />
							);
						}
					}
				})()}
			</div>
		);
	}
}
