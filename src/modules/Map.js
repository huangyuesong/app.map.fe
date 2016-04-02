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

	_initMarker (markers, map) {
		let { sites, macRooms } = markers;

        let siteLngLatArr = [];
        sites.map((site)=> {
        	siteLngLatArr.push([site.longitude, site.latitude]);
        });

        let macRoomLngLatArr = [];
        macRooms.map((macRoom)=> {
        	macRoomLngLatArr.push([macRoom.longitude, macRoom.latitude]);
        });

        new Promise((resolve, reject)=> {
        	while (siteLngLatArr.length > 0) {
	        	let tmp = siteLngLatArr.splice(0, 300);

	        	AMap.convertFrom(tmp, 'gps', (status, result)=> {
	        		let { locations } = result;
		     		let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, -30)});

				    for (let i = 0, marker; i < locations.length; ++i) {
				        let marker = new AMap.Marker({
				            position: [locations[i].lng, locations[i].lat],
				            map: map,
				            icon: new AMap.Icon({            
					            size: new AMap.Size(30, 30),
					            image: '/images/marker_black.png',
					        }),
				        });

				        marker.content = `基站${i + 1}`;
				        marker.on('click', (evt)=> {
				        	infoWindow.setContent(evt.target.content);
				        	infoWindow.open(map, evt.target.getPosition());
				        });
				    }
				    
				    // map.setFitView();

				    return resolve();
		        });
	        }
        })
        .then(()=> {
        	while (macRoomLngLatArr.length > 0) {
	        	let tmp = macRoomLngLatArr.splice(0, 300);

	        	AMap.convertFrom(tmp, 'gps', (status, result)=> {
	        		let { locations } = result;
		     		let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

				    for (let i = 0, marker; i < locations.length; ++i) {
				        let marker = new AMap.Marker({
				            position: [locations[i].lng, locations[i].lat],
				            map: map,
				        });

				        marker.content = `机房${i + 1}`;
				        marker.on('click', (evt)=> {
				        	infoWindow.setContent(evt.target.content);
				        	infoWindow.open(map, evt.target.getPosition());
				        });
				    }

				    // map.setFitView();

					setTimeout(()=> {
						this.setState({
					    	amapLoading: false,
					    });
					}, 500);
		        });
	        }
        });
	}

	_initMapWithCityName (cityName) {
		let map = new AMap.Map('map');

		map.plugin(["AMap.ToolBar", "AMap.Scale"], ()=> {
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
        });

        map.setCity(cityName);

        return map;
	}

	_fetchMarker (cId) {
		let { energySystemURL } = config;

		let form = new FormData();
		form.append('cId', JSON.stringify(cId.split(',').map(Number)));

		fetch(`${energySystemURL}/nodeLocation`, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((json)=> {
			this.markers = json;
			this._filterMarker(json);
		})
		.catch((err)=> {
			alert(err);
		});
	}

	_filterMarker (markers) {
		let DELTA = 1 / this.companyLevel;
		let { lng, lat } = this.map.getCenter();
		let { sites, macRooms } = markers;

		// console.log([lng, lat]);
		// console.log(gcj02towgs84(lng, lat))
		// AMap.convertFrom(gcj02towgs84(lng, lat), 'gps', (status, result)=> {
		// 	console.log(result.locations)
		// });

		sites = sites.filter((site)=> {
			if (site.longitude < lng - DELTA
				|| site.longitude > lng + DELTA
				|| site.latitude < lat - DELTA
				|| site.latitude > lat + DELTA) {
				return false;
			} else {
				return true;
			}
		});

		macRooms = macRooms.filter((macRoom)=> {
			if (macRoom.longitude < lng - DELTA
				|| macRoom.longitude > lng + DELTA
				|| macRoom.latitude < lat - DELTA
				|| macRoom.latitude > lat + DELTA) {
				return false;
			} else {
				return true;
			}
		});

		this._initMarker({
			sites: sites,
			macRooms: macRooms,
		}, this.map);
	}

	componentDidMount () {
		let { cId, companyLevel, dataPlace } = this.props.location.query;
		this.companyLevel = companyLevel;

		if (dataPlace === '移动') {
			dataPlace = '北京';
		}

		let map = this.map = this._initMapWithCityName(dataPlace);

		map.setZoom(companyLevel * 4);
		map.on('dragend', ()=> {
			this.setState({
				amapLoading: true,
			});

			this._filterMarker(this.markers);
		});

		this._fetchMarker(cId);
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
