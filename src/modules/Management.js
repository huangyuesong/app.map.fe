import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/Management.scss';

import ListView from 'listview-react';
import Tab from './Tab';
import Search from './Search';
import DistrictSelect from './DistrictSelect';

import { browserHistory } from 'react-router';

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
			needManualyLoading: false,
		};
	}

	_errorHandler (err) {
		alert(err);
	}

	_onSiteClick (site) {
		window.localStorage.site = JSON.stringify(site);
		
		browserHistory.push('/SiteDetail');
	}

	_renderSiteList (item, idx) {
		return (
			<div key={idx} className="site-info-row-wrapper" onClick={(evt)=> this._onSiteClick(item)}>
				<p>{item.name}</p>
				<p>{item.city}</p>
			</div>
		);
	}

	_renderMacRoomList (item, idx) {
		return (
			<div key={idx} className="mac-room-info-row-wrapper" onClick={()=> console.log(item.id)}>
				<p>{item.name}</p>
				<p>{item.city}</p>
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
				}, ()=> {
					this.listview.unlockReachEndEvent();
				});
			}, 500);
		})
		.catch((err)=> {
			this.setState({
				needManualyLoading: true,
				loading: false,
			}, ()=> {
				this._errorHandler(err);
			});
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
				}, ()=> {
					this.listview.unlockReachEndEvent();
				});
			}, 500);
		})
		.catch((err)=> {
			this.setState({
				needManualyLoading: true,
				loading: false,
			}, ()=> {
				this._errorHandler(err);
			});
		});
	}

	_fetchDistrictList () {
		let { energySystemURL } = config;
		let { pageIndex } = this.state;

		return fetch(`${energySystemURL}/getDistrictList`)
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			return new Promise((resolve, reject)=> {
				let { districts } = data;
				let _districts = {};

				districts.map((district)=> {
					let { province, city, county } = district;

					if (_districts[province] === undefined) {
						_districts[province] = {};
					}

					if (_districts[province][city] === undefined) {
						_districts[province][city] = [];
					} else {
						_districts[province][city].push(county);
					}
				});

				resolve(_districts);
			});
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

	_renderLoading () {
		if (this.state.loading) {
			return <ListView.Loading className="loading" />;
		}

		if (this.state.needManualyLoading) {
			return <button className="load-manualy" onClick={this._manualyLoad.bind(this)}>点击加载更多</button>;
		}

		return null;
	}

	_renderHeader () {
		return (
			<div className="fixed-wrapper">
				<Tab onSelect={(idx)=> this.setState({seletedTab: idx})} />
				<DistrictSelect 
					districts={this.districts}
					onSelect={this._onDistrictSelect.bind(this)} />
				<Search 
					target={this.state.seletedTab === 0 ? '基站' : '机房'}
					onSearch={this._onSearch.bind(this)} />
				<p className="hint">(点按查看详情)</p>
			</div>
		);
	}

	_manualyLoad () {
		this.setState({
			needManualyLoading: false,
		}, ()=> {
			if (this.state.seletedTab === 1) {
				this._fetchMacRoom();
			} else if (this.state.seletedTab === 0) {
				this._fetchSite();
			}
		});
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

	_onDistrictSelect (district) {
		let { province, city, county } = district;

		this.setState({
			province: province,
			city: city,
			county: county,
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
		this.setState({
			loading: true,
		});

		this._fetchDistrictList().then((districts)=> {
			this.districts = districts;
			this._fetchSite();
		});
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.seletedTab === 0 && nextState.seletedTab === 1) {
			this.setState({
				listData: [],
				pageIndex: 1,
				fetchMoreData: true,
			}, ()=> this._fetchMacRoom());
		} else if (this.state.seletedTab === 1 && nextState.seletedTab === 0) {
			this.setState({
				listData: [],
				pageIndex: 1,
				fetchMoreData: true,
			}, ()=> this._fetchSite());
		}
	}

	render () {
		let listviewStyle = {
			height: window.innerHeight,
		};
		let { username, password } = this.props.location.query;

		return (
			<div className="management-page">
				<span className="go-back" onClick={(evt)=> browserHistory.push('/')}>回上一页</span>
				<a className="back-to-top" href="#">回顶部</a>
				<span className="go-to-map" 
						onClick={evt=> browserHistory.push(`/Map?username=${username}&password=${password}`)}>
					查看地图
				</span>

				{(()=> {
					if (this.state.seletedTab === 0) {
						return (
							<ListView
								ref={(view)=> this.listview = view}
								style={listviewStyle}
								data={this.state.listData}
								renderItem={this._renderSiteList.bind(this)}
								enableOnEndReachedEvent={true}
								onEndReached={this._fetchSite.bind(this)}
								renderPullUI={this._renderLoading.bind(this)}
								renderHeader={this._renderHeader.bind(this)}
								renderFooter={this._renderLoading.bind(this)} />
						);
					} else if (this.state.seletedTab === 1) {
						return (
							<ListView
								ref={(view)=> this.listview = view}
								style={listviewStyle}
								data={this.state.listData}
								renderItem={this._renderMacRoomList.bind(this)}
								enableOnEndReachedEvent={true}
								onEndReached={this._fetchMacRoom.bind(this)}
								renderPullUI={this._renderLoading.bind(this)}
								renderHeader={this._renderHeader.bind(this)}
								renderFooter={this._renderLoading.bind(this)} />
						);
					}
				})()}
			</div>
		);
	}
}