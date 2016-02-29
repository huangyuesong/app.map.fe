import React, {
	Component,
} from 'react';

import '../styles/Loading.scss';

export default class Loading extends Component {

  	render () {
    	return (
    		<div className="init-loading-wrapper">
				<div className="init-loading">
					<div className="spinner-loader">
					</div>
				</div>
				<div className="init-loading-text-wrapper">
					<span>正在加载</span>
				</div>
			</div>
    	);
  	}
}
