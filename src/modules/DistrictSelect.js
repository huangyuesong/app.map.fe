import React, {
	Component,
} from 'react';

import '../styles/DistrictSelect.scss';

export default class DistrictSelect extends Component {

	constructor (props) {
		super(props);

		this.state = {
			province: '',
			city: '',
			county: '',
		}
	}

	static defaultProps = {
		districts: {},
		onSelect: ()=> null,
	};

	_onProvinceChange (evt) {
		this.setState({
			province: evt.target.value.replace('全国', ''),
			city: '',
			county: '',
		}, ()=> {
			this.refs.city.selectedIndex = 0;
			this.refs.county.selectedIndex = 0;
			this.props.onSelect(this.state);
		});
	}

	_onCityChange (evt) {
		this.setState({
			city: evt.target.value.replace('-', ''),
			county: '',
		}, ()=> {
			this.refs.county.selectedIndex = 0;
			this.props.onSelect(this.state);
		});
	}

	_onCountyChange (evt) {
		this.setState({
			county: evt.target.value.replace('-', ''),
		}, ()=> {
			this.props.onSelect(this.state);
		});
	}

	render () {
		let { districts } = this.props;

		return (
			<div className="district-select-wrapper">
				<select onChange={this._onProvinceChange.bind(this)}>
					<option>全国</option>
					{(()=> {
						let provinceArr = [];

						Object.keys(districts).map((province, idx)=> {
							provinceArr.push(<option key={idx}>{province}</option>);
						});

						return provinceArr;
					})()}
				</select>
				<select ref="city" onChange={this._onCityChange.bind(this)}>
					<option>-</option>
					{(()=> {
						if (this.state.province) {
							let cityArr = [];

							Object.keys(districts[this.state.province]).map((city, idx)=> {
								cityArr.push(<option key={idx}>{city}</option>);
							});

							return cityArr;
						}
					})()}
				</select>
				<select ref="county" onChange={this._onCountyChange.bind(this)}>
					<option>-</option>
					{(()=> {
						if (this.state.city) {
							let countyArr = [];

							districts[this.state.province][this.state.city].map((county, idx)=> {
								countyArr.push(<option key={idx}>{county}</option>);
							});

							return countyArr;
						}
					})()}
				</select>
			</div>
		);
	}
}
