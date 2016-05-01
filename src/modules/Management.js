import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/Management.scss';

import Tab from './Tab';

import ListView from 'listview-react';

import Back from './Back';

import Search from './Search';

const pageSize = 10;

export default class Management extends Component {

	constructor (props) {
		super(props);

		this.state = {
			loading: true,
			seletedTab: 0,
			pageIndex: 1,
			listData: [],
			fetchMoreData: true,
			keyword: '',
			province: '',
			city: '',
			county: '',
		};
	}

	_errorHandler (err) {
		alert(err);
	}

	_renderSiteList (item, idx) {
		return (
			<div key={idx} className="site-info-row-wrapper">
				<p>{item.name}</p>

				<p>{item.longitude}</p>

				<p>{item.latitude}</p>
			</div>
		);
	}

	_renderMacRoomList (item, idx) {
		return (
			<div key={idx} className="mac-room-info-row-wrapper">
				<p>{item.name}</p>

				<p>{item.longitude}</p>

				<p>{item.latitude}</p>
			</div>
		);
	}

	_fetchSite () {
		if (!this.state.fetchMoreData) {
			return;
		}

		this.setState({
			loading: true,
		});

		let { energySystemURL } = config;
		let { pageIndex, keyword, province, city, county } = this.state;

		let form = new FormData();

		form.append('pageIndex', pageIndex);
		form.append('pageSize', pageSize);
		form.append('keyword', keyword);
		form.append('province', province);
		form.append('city', city);
		form.append('county', county);

		fetch(`${energySystemURL}/searchSite`, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			if (data.sites.length < pageSize) {
				this.setState({
					fetchMoreData: false,
				});
			}

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
		if (!this.state.fetchMoreData) {
			return;
		}

		this.setState({
			loading: true,
		});

		let { energySystemURL } = config;
		let { pageIndex, keyword, province, city, county } = this.state;

		let form = new FormData();

		form.append('pageIndex', pageIndex);
		form.append('pageSize', pageSize);
		form.append('keyword', keyword);
		form.append('province', province);
		form.append('city', city);
		form.append('county', county);

		fetch(`${energySystemURL}/searchMacRoom`, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			if (data.macRooms.length < pageSize) {
				this.setState({
					fetchMoreData: false,
				});
			}
			
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

	_fetchDistrictList () {
		let { energySystemURL } = config;
		let { pageIndex } = this.state;

		fetch(`${energySystemURL}/getDistrictList`)
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			this.districtList = data.districts;
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

	_onSearch (keyword) {
		this.setState({
			keyword: keyword,
			listData: [],
			pageIndex: 1,
			fetchMoreData: true,
		}, ()=> {
			if (this.state.seletedTab === 1) {
				this._fetchMacRoom();
			} else if (this.state.seletedTab === 0) {
				this._fetchSite();
			}
		});
	}

	componentDidMount () {
		this._fetchDistrictList();
		this._fetchSite();
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.seletedTab === 0 && nextState.seletedTab === 1) {
			this.setState({
				listData: [],
				pageIndex: 1,
			}, ()=> this._fetchMacRoom());
		} else if (this.state.seletedTab === 1 && nextState.seletedTab === 0) {
			this.setState({
				listData: [],
				pageIndex: 1,
			}, ()=> this._fetchSite());
		}
	}

	render () {
		let listviewStyle = {
			height: window.innerHeight - 60,
		};

		return (
			<div className="management-page">
				<div className="fixed-wrapper">
					<Tab onSelect={(idx)=> this.setState({seletedTab: idx})} />
					<Back />
					<Search 
						target={this.state.seletedTab === 0 ? '基站' : '机房'}
						onSearch={this._onSearch.bind(this)} />
				</div>

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
