import React, {
	Component,
} from 'react';

import '../styles/Loading.scss';

export default class Loading extends Component {

  	render () {
    	return (
    		<div className="amap-loading-wrapper">
				<div className="amap-loading">
					<p>地图玩命加载中...</p>
				</div>
			</div>
    	);
  	}
}
