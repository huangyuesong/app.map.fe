import React, {
	Component,
} from 'react';

import config from '../../config/index';

import '../styles/SiteDetail.scss';

import { browserHistory } from 'react-router';

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

	_onUpdate (evt) {

	}

	_onDelete (evt) {
		if (confirm('确认删除这个基站吗？') || !confirm) {
			let { energySystemUrl } = config;

			let form = new FormData();
			form.append('siteId', this.state.id);
			fetch(`${energySystemUrl}/deleteSite`, {
				method: 'post',
				body: form,
			}).then(res=> res.json())
				.then(json=> alert(json.success ? '删除成功' : json.errors))
				.catch(err=> alert(err));
		}
	}

	render () {
		return (
			<div className="site-datail-wrapper">
				<span className="go-back"
						onClick={evt=> browserHistory.goBack()}>
					回上一页
				</span>
				<span className="update" onClick={this._onUpdate.bind(this)}>
					保存修改
				</span>
				<span className="insert" onClick={evt=> this.setState({
					area: '',
					carrierCount: '',
					city: '',
					id: '',
					identityNo: '',
					isFlag: '',
					latitude: '',
					longitude: '',
					name: '',
					powerId: '',
					powerPrice: '',
					typeId: '',
					useDate: '',
					wallInfo: '',
				}, ()=> alert('请设置基站信息'))}>
					新增基站
				</span>
				<span className="delete" onClick={this._onDelete.bind(this)}>
					删除
				</span>
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