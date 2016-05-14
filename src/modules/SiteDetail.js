import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/SiteDetail.scss';

import Back from './Back';

export default class SiteDetail extends Component {

	constructor (props) {
		super(props);

		let {
			area,
			carrierCount,
			city,
			id,
			identityNo,
			isFlag,
			latitude,
			longitude,
			name,
			powerId,
			powerPrice,
			typeId,
			useDate,
			wallInfo,
		} = JSON.parse(window.localStorage.site);

		this.state = {
			area: area,
			carrierCount: carrierCount,
			city: city,
			id: id,
			identityNo: identityNo,
			isFlag: isFlag,
			latitude: latitude,
			longitude: longitude,
			name: name,
			powerId: powerId,
			powerPrice: powerPrice,
			typeId: typeId,
			useDate: useDate.substring(0, 10),
			wallInfo: wallInfo,
		};
	}

	render () {
		return (
			<div className="site-datail-wrapper">
				<Back />
				<p>基站编号</p>
				<input type="text" value={this.state.identityNo} 
					onChange={(evt)=> this.setState({identityNo: evt.target.value})}/>
				<p>基站名称</p>
				<input type="text" value={this.state.name} 
					onChange={(evt)=> this.setState({name: evt.target.value})}/>
				<p>基站类型ID</p>
				<input type="text" value={this.state.typeId} 
					onChange={(evt)=> this.setState({typeId: evt.target.value})}/>
				<p>基站面积</p>
				<input type="text" value={this.state.area} 
					onChange={(evt)=> this.setState({area: evt.target.value})}/>
				<p>供电类型</p>
				<input type="text" value={this.state.powerId} 
					onChange={(evt)=> this.setState({powerId: evt.target.value})}/>
				<p>启用时间</p>
				<input type="date" value={this.state.useDate} 
					onChange={(evt)=> this.setState({useDate: evt.target.value})}/>
				<p>电价</p>
				<input type="text" value={this.state.powerPrice} 
					onChange={(evt)=> this.setState({powerPrice: evt.target.value})}/>
				<p>经度</p>
				<input type="text" value={this.state.latitude} 
					onChange={(evt)=> this.setState({latitude: evt.target.value})}/>
				<p>纬度</p>
				<input type="text" value={this.state.longitude} 
					onChange={(evt)=> this.setState({longitude: evt.target.value})}/>
				<p>墙体信息</p>
				<input type="text" value={this.state.wallInfo} 
					onChange={(evt)=> this.setState({wallInfo: evt.target.value})}/>
				<p>载频数</p>
				<input type="text" value={this.state.carrierCount} 
					onChange={(evt)=> this.setState({carrierCount: evt.target.value})}/>
				<p>是否标杆</p>
				<select selectedIndex={this.state.isFlag} 
					onChange={(evt)=> this.setState({isFlag: evt.target.selectedIndex})}>
					<option>否</option>
					<option>是</option>
				</select>
			</div>
		);
	}
}