import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/SiteDetail.scss';

export default class SiteDetail extends Component {

	constructor (props) {
		super(props);

		let { id, identityNo } = JSON.parse(window.localStorage.site);

		this.state = {
			id: id,
			identityNo: identityNo,
		};
	}

	render () {
		return (
			<div className="site-datail-wrapper">
				<p>基站编号</p>
				<input type="text" value={this.state.identityNo} 
					onChange={(evt)=> this.setState({identityNo: evt.target.value})}/>
				<p>基站名称</p>
				<input type="text" value=""/>
				<p>基站类型ID</p>
				<input type="text" value=""/>
				<p>基站面积</p>
				<input type="text" value=""/>
				<p>供电类型</p>
				<input type="text" value=""/>
				<p>启用时间</p>
				<input type="text" value=""/>
				<p>电价</p>
				<input type="text" value=""/>
				<p>经度</p>
				<input type="text" value=""/>
				<p>纬度</p>
				<input type="text" value=""/>
				<p>墙体信息</p>
				<input type="text" value=""/>
				<p>载频数</p>
				<input type="text" value=""/>
				<p>是否标杆</p>
				<select>
					<option>是</option>
					<option>否</option>
				</select>
			</div>
		);
	}
}