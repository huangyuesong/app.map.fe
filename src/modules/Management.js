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
			pageSize: 10,
			pageIndex: 1,
			listData: [],
		};
	}

	_errorHandler (err) {
		alert(err);
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

	_fetchSite () {
		this.setState({
			loading: true,
		});

		let { energySystemURL } = config;
		let { pageSize, pageIndex } = this.state;

		fetch(`${energySystemURL}/getSiteInfo_SiteManagementAction?pageSize=${pageSize}&pageIndex=${pageIndex}`)
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			setTimeout(()=> {
				this.setState({
					loading: false,
					listData: this.state.listData.concat(data.sites),
					pageIndex: this.state.pageIndex + 1,
				});
			}, 500);
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

	_fetchMacRoom () {
		this.setState({
			loading: true,
		});

		let { energySystemURL } = config;
		let { pageSize, pageIndex } = this.state;

		fetch(`${energySystemURL}/getMacRoomInfo_SiteManagementAction?pageSize=${pageSize}&pageIndex=${pageIndex}`)
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			setTimeout(()=> {
				this.setState({
					loading: false,
					listData: this.state.listData.concat(data.macRooms),
					pageIndex: this.state.pageIndex + 1,
				});
			}, 500);
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

	_renderLoading () {
		if (this.state.loading) {
			return <ListView.Loading className="loading" />;
		}

		return null;
	}

	componentDidMount () {
		this._fetchSite();
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.seletedTab === 0 && nextState.seletedTab === 1) {
			this.setState({
				listData: [],
				pageIndex: 1,
			});

			this._fetchMacRoom();
		} else if (this.state.seletedTab === 1 && nextState.seletedTab === 0) {
			this.setState({
				listData: [],
				pageIndex: 1,
			});

			this._fetchSite();
		}
	}

	render () {
		let listviewStyle = {
			height: window.innerHeight - 60,
		};

		return (
			<div className="management-page">
				<Tab onSelect={(idx)=> this.setState({seletedTab: idx})} />

				{(()=> {
					if (this.state.seletedTab === 0) {
						return (
							<ListView
								style={listviewStyle}
								data={this.state.listData}
								renderItem={this._renderSiteList.bind(this)}
								enableOnEndReachedEvent={true}
								onEndReached={this._fetchSite.bind(this)}
								renderPullUI={this._renderLoading.bind(this)}
								renderFooter={this._renderLoading.bind(this)} />
						);
					} else if (this.state.seletedTab === 1) {
						return (
							<ListView
								style={listviewStyle}
								data={this.state.listData}
								renderItem={this._renderMacRoomList.bind(this)}
								enableOnEndReachedEvent={true}
								onEndReached={this._fetchMacRoom.bind(this)}
								renderPullUI={this._renderLoading.bind(this)}
								renderFooter={this._renderLoading.bind(this)} />
						);
					}
				})()}
			</div>
		);
	}
}
