import React, {
	Component,
} from 'react';

import { browserHistory } from 'react-router';

import '../styles/Login.scss';

import config from '../../config/index';

export default class Login extends Component {

	constructor (props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			// randNum: '',
		};
	}

	_onLoginBtnClick (evt) {
		const url = `${config.energySystemURL}/loginIn_LoginInAction.action`;
		let form = new FormData();
		form.append('username', this.state.username);
		form.append('password', this.state.password);
		// form.append('randNum', this.state.randNum);

		fetch(url, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((data)=> {
			if (data.success) {
				browserHistory.push(`/Map`);
			} else {
				alert(data.errors);
			}
		})
		.catch((err)=> {
			alert(err);
		});
	}

	render () {
		return (
			<div className="login-wrapper">
				<h1>请登录</h1>

				<table className="login-tb">
					<tbody>
						<tr>
							<td className="label">
								<label htmlFor="username">用户名：</label>
							</td>
							<td>
								<input id="username"
									onChange={(evt)=> this.setState({username: evt.target.value})} />
							</td>
						</tr>
						<tr>
							<td className="label">
								<label htmlFor="password">密码：</label>
							</td>
							<td>
								<input id="password" name="password" type="password"
									onChange={(evt)=> this.setState({password: evt.target.value})} />
							</td>
						</tr>
						{/*<tr>
							<td className="label">
								<label htmlFor="randNum">验证码：</label>
							</td>
							<td>
								<input id="randNum"
									onChange={(evt)=> this.setState({randNum: evt.target.value})} />
							</td>
							<td>
								<img src={`${config.energySystemURL}/randNum.action`} />
							</td>
						</tr>*/}
					</tbody>
				</table>

				<div className="btn-wrapper">
					<button onClick={this._onLoginBtnClick.bind(this)}>登录</button>
					<button onClick={()=> location.reload()}>重置</button>
				</div>
			</div>
		);
	}
}
