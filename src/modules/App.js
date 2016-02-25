import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/App.scss';

export default class App extends Component {

	_initMap (markers) {
		let map = new AMap.Map('map');

		map.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
        });

	    let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

	    for (let i = 0, marker; i < markers.length; ++i) {
	        let marker = new AMap.Marker({
	            position: markers[i].position,
	            map: map,
	        });

	        marker.content = markers[i].info;
	        marker.on('click', (e)=> {
	        	infoWindow.setContent(e.target.content);
	        	infoWindow.open(map, e.target.getPosition());
	        });
	        marker.emit('click', {target: marker});
	    }

	    map.setFitView();
	}

	componentDidMount () {
		const PROTOCOL = 'http://';
		const IP = config.IP;
		const PORT = ':8081';
		const PATH = '/get/marker';

		fetch(`${PROTOCOL}${IP}${PORT}${PATH}`)
			.then((res)=> {
				return res.json();
			})
			.then((json)=> {
				let markers = json.markers;
				this._initMap(markers);
			})
			.catch((err)=> {
				throw err;
			});
	}

  	render () {
    	return (
    		<div id="map"></div>
    	);
  	}
}
