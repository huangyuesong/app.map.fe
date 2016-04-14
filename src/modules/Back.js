import React, {
	Component,
} from 'react';

import { browserHistory } from 'react-router';

import '../styles/Back.scss';

export default class Back extends Component {

  	render () {
    	return (
    		<div className="back" onClick={(evt)=> browserHistory.goBack()}>
				<p>{`<-返回`}</p>
			</div>
    	);
  	}
}
