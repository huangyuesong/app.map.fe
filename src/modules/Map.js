import React, {
	Component,
} from 'react';

import { browserHistory } from 'react-router';

import Loading from './Loading';

import config from '../../config/index';

import '../styles/Map.scss';

export default class Map extends Component {

	constructor (props) {
		super(props);

		this.state = {
			initLoading: true,
			amapLoading: true,
		};
	}

	_initMap (markers) {
		let map = new AMap.Map('map');

		map.plugin(["AMap.ToolBar", "AMap.Scale"], ()=> {
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
        });

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
				    
				    map.setFitView();

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

				    map.setFitView();

				    setTimeout(()=> {
				    	this.setState({
					    	amapLoading: false,
					    });
				    }, 15000);
		        });
	        }
        });
	}

	componentDidMount () {
		let { cId, companyLevel } = this.props.location.query;
		let { energySystemURL } = config;

		let form = new FormData();
		form.append('cId', JSON.stringify(cId.split(',').map(Number)));
		form.append('companyLevel', companyLevel);

		fetch(`${energySystemURL}/nodeLocation`, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			this.setState({
				initLoading: false,
			});
			return res.json();
		})
		.then((json)=> {
			this._initMap(json);
		})
		.catch((err)=> {
			alert(err);
		});
	}

  	render () {
		if (this.state.initLoading) {
			return (
				<Loading />
			);
		} else {
			if (this.state.amapLoading) {
				return (
					<div className="map-wrapper">
						<div id="map"></div>

						<div className="back" onClick={(evt)=> browserHistory.goBack()}>
							<p>{`<返回`}</p>
						</div>

						<div className="amap-loading-wrapper">
							<div className="amap-loading">
								<p>地图玩命加载中...</p>
							</div>
						</div>
					</div>
				);
			} else {
				return (
					<div className="map-wrapper">
						<div id="map"></div>

						<div className="back" onClick={(evt)=> browserHistory.goBack()}>
							<p>{`<返回`}</p>
						</div>
					</div>
				);
			}
		}
  	}
}
