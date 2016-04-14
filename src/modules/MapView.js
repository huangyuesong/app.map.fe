import React, {
	Component,
} from 'react';

import Loading from './Loading';

import Back from './Back';

import config from '../../config/index';

import '../styles/MapView.scss';

import gcj02towgs84 from '../utils/coordinate';

export default class MapView extends Component {

	constructor (props) {
		super(props);

		this.state = {
			amapLoading: true,
		};
	}

	_errorHandler (err) {
		alert(err);
		location.reload();
	}

	_fetchSiteKPI (siteId) {
		this.setState({
			amapLoading: true,
		});

		let { energySystemURL } = config;

		return (
			fetch(`${energySystemURL}/siteKPI?siteId=${siteId}`)
			.then((res)=> {
				return res.json();
			})
			.then((json)=> {
				this.setState({
					amapLoading: false,
				});

				return new Promise((resolve, reject)=> {
					resolve(json.PowerExpend);
				});
			})
			.catch((err)=> {
				this._errorHandler(err);
			})
		);
	}

	_fetchMacRoomKPI (macRoomId) {
		this.setState({
			amapLoading: true,
		});

		let { energySystemURL } = config;

		return (
			fetch(`${energySystemURL}/macRoomKPI?macRoomId=${macRoomId}`)
			.then((res)=> {
				return res.json();
			})
			.then((json)=> {
				this.setState({
					amapLoading: false,
				});
				
				return new Promise((resolve, reject)=> {
					resolve(json.PowerExpend);
				});
			})
			.catch((err)=> {
				this._errorHandler(err);
			})
		);
	}

	_initMarker () {
		let map = this.map;
		let { sites, macRooms } = this;

		map.clearMap();

		sites.map((site)=> {
			let { id } = site;
			let { lng, lat } = site.location;

			let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, -30)});

	        let marker = new AMap.Marker({
	            position: [lng, lat],
	            map: map,
	            icon: new AMap.Icon({            
		            size: new AMap.Size(30, 30),
		            image: '/images/marker_black.png',
		        }),
	        });

			marker.on('click', (evt)=> {
				this._fetchSiteKPI(id)
				.then((PowerExpend)=> {
					infoWindow.setContent(`总能耗: ${PowerExpend}`);
					infoWindow.open(map, evt.target.getPosition());
				});
			});
		});

		macRooms.map((macRoom)=> {
			let { id } = macRoom;
			let { lng, lat } = macRoom.location;

			let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

	        let marker = new AMap.Marker({
	            position: [lng, lat],
	            map: map,
	        });

			marker.on('click', (evt)=> {
				this._fetchMacRoomKPI(id)
				.then((PowerExpend)=> {
					infoWindow.setContent(`总能耗: ${PowerExpend}`);
					infoWindow.open(map, evt.target.getPosition());
				});
			});
		});
	}

	_initMapWithCityName (cityName, cId) {
		return new Promise((resolve, reject)=> {
			let map = new AMap.Map('map');

			map.plugin(["AMap.ToolBar", "AMap.Scale"], ()=> {
	            map.addControl(new AMap.ToolBar());
	            map.addControl(new AMap.Scale());
	        });

	        map.on('dragend', ()=> {
	        	this._fetchMarker(cId);
			});

	        map.setCity(cityName, ()=> {
	        	return resolve(map);
	        });
		});
	}

	_fetchMarker (cId) {
		this.setState({
			amapLoading: true,
		});

		const DISTANCE = 1.0;
		let { northeast, southwest } = this.map.getBounds();
		let { lng, lat } = this.map.getCenter();
		let { energySystemURL } = config;

		let form = new FormData();
		form.append('cId', JSON.stringify(cId.split(',').map(Number)));
		form.append('center', JSON.stringify(gcj02towgs84(lng, lat)));
		form.append('southwest', JSON.stringify(gcj02towgs84(southwest.lng, southwest.lat)));
		form.append('northeast', JSON.stringify(gcj02towgs84(northeast.lng, northeast.lat)));
		form.append('distance', DISTANCE);

		fetch(`${energySystemURL}/nodeLocation`, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((json)=> {
			this.sites = json.sites;
			this.macRooms = json.macRooms;

			this._convertMarker()
			.then(()=> {
				this.setState({
			    	amapLoading: false,
			    });

				this._initMarker();
			});
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

	_convertMarker () {
		let { sites, macRooms } = this;
        let siteLngLatArr = [];
        let macRoomLngLatArr = [];
        let siteConvertArr = [];
        let macRoomConvertArr = [];
        let siteLocations = [];
        let macRoomLocations = [];

        for (let i = 0; i < sites.length; ++i) {
        	let site = sites[i];

        	siteLngLatArr.push([site.longitude, site.latitude]);
        }

        for (let i = 0; i < macRooms.length; ++i) {
        	let macRoom = macRooms[i];

        	macRoomLngLatArr.push([macRoom.longitude, macRoom.latitude]);
        }

        while (siteLngLatArr.length > 0) {
        	siteConvertArr.push(siteLngLatArr.splice(0, 300));
        }

        while (macRoomLngLatArr.length > 0) {
        	macRoomConvertArr.push(macRoomLngLatArr.splice(0, 300));
        }

        return new Promise((resolve, reject)=> {
        	if (sites.length === 0) {
        		return resolve();
        	}

        	let getPromise = (idx)=> {
        		return new Promise((resolve, reject)=> {
	        		AMap.convertFrom(siteConvertArr[idx], 'gps', (status, result)=> {
	        			return resolve({
	        				index: idx,
	        				locations: result.locations,
	        			});
	        		});
	        	})
        	};

        	for (let i = 0; i < siteConvertArr.length; ++i) {
        		getPromise(i)
	        	.then((data)=> {
	        		siteLocations = siteLocations.concat(data);

	        		if (i === siteConvertArr.length - 1) {
		        		siteLocations.sort((elm1, elm2)=> {
		        			if (elm1.index < elm2.index) {
		        				return -1;
		        			} else if (elm1.index === elm2.index) {
		        				return 0;
		        			} else {
		        				return 1;
		        			}
		        		});

		        		return resolve();
		        	}
	        	})
	        	.catch((err)=> {
	        		this._errorHandler(err);
	        	});
        	}
        })
        .then(()=> {
	        return new Promise((resolve, reject)=> {
	        	if (macRooms.length === 0) {
	        		return resolve();
	        	}

	        	let getPromise = (idx)=> {
	        		return new Promise((resolve, reject)=> {
		        		AMap.convertFrom(macRoomConvertArr[idx], 'gps', (status, result)=> {
		        			return resolve({
		        				index: idx,
		        				locations: result.locations,
		        			});
		        		});
		        	})
	        	};

	        	for (let i = 0; i < macRoomConvertArr.length; ++i) {
	        		getPromise(i)
	        		.then((data)=> {
	        			macRoomLocations = macRoomLocations.concat(data);

	        			if (i === macRoomConvertArr.length - 1) {
	        				macRoomLocations.sort((elm1, elm2)=> {
			        			if (elm1.index < elm2.index) {
			        				return -1;
			        			} else if (elm1.index === elm2.index) {
			        				return 0;
			        			} else {
			        				return 1;
			        			}
			        		});

			        		return resolve();
			        	}
	        		})
	        		.catch((err)=> {
	        			this._errorHandler(err);
	        		});
	        	}
	        });
        })
		.then(()=> {
			return new Promise((resolve, reject)=> {
				siteLocations = siteLocations.map((elm)=> {
					return elm.locations;
				});

				macRoomLocations = macRoomLocations.map((elm)=> {
					return elm.locations;
				});

				siteConvertArr = [];
				macRoomConvertArr = [];

				for (let i = 0; i < siteLocations.length; ++i) {
					siteConvertArr = siteConvertArr.concat(siteLocations[i]);
				}

				for (let i = 0; i < macRoomLocations.length; ++i) {
					macRoomConvertArr = macRoomConvertArr.concat(macRoomLocations[i]);
				}

				return resolve();
			});
		})
        .then(()=> {
	        return new Promise((resolve, reject)=> {
	        	if (sites.length === 0) {
	        		return resolve();
	        	}

	        	for (let i = 0; i < sites.length; ++i) {
	        		let site = sites[i];
	        		let location = siteConvertArr[i];

	        		site.location = location;

	        		if (i === sites.length - 1) {
	        			return resolve();
	        		}
	        	}
	        });
        })
        .then(()=> {
        	return new Promise((resolve, reject)=> {
        		if (macRooms.length === 0) {
        			return resolve();
        		}

        		for (let i = 0; i < macRooms.length; ++i) {
	        		let macRoom = macRooms[i];
	        		let location = macRoomConvertArr[i];

	        		macRoom.location = location;

	        		if (i === macRooms.length - 1) {
	        			return resolve();
	        		}
	        	}
        	});
        });
	}

	componentDidMount () {
		let { cId, companyLevel, dataPlace } = this.props.location.query;

		if (dataPlace === '移动') {
			dataPlace = '北京';
		}

		this._initMapWithCityName(dataPlace, cId)
		.then((map)=> {
			this.map = map;

			map.setZoom(companyLevel * 3);
			this._fetchMarker(cId);
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

  	render () {
		if (this.state.amapLoading) {
			return (
				<div className="map-wrapper">
					<div id="map"></div>
					<Loading />
					<Back />
				</div>
			);
		} else {
			return (
				<div className="map-wrapper">
					<div id="map"></div>
					<Back />
				</div>
			);
		}
  	}
}
