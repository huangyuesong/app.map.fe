import React, {
	Component,
} from 'react';

import '../styles/Tab.scss';

export default class Tab extends Component {

	constructor (props) {
		super(props);

		this.state = {
			seletedTab: 0,
		};
	}

	render () {
		return (
			<div className="tab-wrapper">
				<span
					className={`tab ${this.state.seletedTab === 0 ? 'active' : ''}`}
					onClick={(evt)=> {
						this.setState({
							seletedTab: 0,
						});

						this.props.onSelect(0);
					}}>
					基站
				</span>

				<span
					className={`tab ${this.state.seletedTab === 1 ? 'active' : ''}`}
					onClick={(evt)=> {
						this.setState({
							seletedTab: 1,
						});

						this.props.onSelect(1);
					}}>
					机房
				</span>
			</div>
		);
	}
}
