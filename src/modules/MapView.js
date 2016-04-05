import React, {
	Component,
} from 'react';

import Loading from './Loading';

import Back from './Back';

import config from '../../config/index';

import '../styles/Map.scss';

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

	        marker.content = `基站${id}`;
	        marker.on('click', (evt)=> {
	        	infoWindow.setContent(evt.target.content);
	        	infoWindow.open(map, evt.target.getPosition());
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

	        marker.content = `机房${id}`;
	        marker.on('click', (evt)=> {
	        	infoWindow.setContent(evt.target.content);
	        	infoWindow.open(map, evt.target.getPosition());
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

        	for (let i = 0; i < siteConvertArr.length; ++i) {
	        	AMap.convertFrom(siteConvertArr[i], 'gps', (status, result)=> {
	        		let { locations } = result;
		     		
		     		siteLocations = siteLocations.concat(locations);

				    if (i === siteConvertArr.length - 1) {
				    	return resolve();
				    }
		        });
	        }
        })
        .then(()=> {
	        return new Promise((resolve, reject)=> {
	        	if (macRooms.length === 0) {
	        		return resolve();
	        	}

	        	for (let i = 0; i < macRoomConvertArr.length; ++i) {
	        		AMap.convertFrom(macRoomConvertArr[i], 'gps', (status, result)=> {
		        		let { locations } = result;

		        		macRoomLocations = macRoomLocations.concat(locations);

					    if (i === macRoomConvertArr.length - 1) {
					    	return resolve();
					    }
			        });
		        }
	        });
        })
        .then(()=> {
	        return new Promise((resolve, reject)=> {
	        	for (let i = 0; i < sites.length; ++i) {
	        		let site = sites[i];
	        		let location = siteLocations[i];

	        		site.location = location;
	        	}

	        	for (let i = 0; i < macRooms.length; ++i) {
	        		let macRoom = macRooms[i];
	        		let location = macRoomLocations[i];

	        		macRoom.location = location;
	        	}

	        	return resolve();
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
