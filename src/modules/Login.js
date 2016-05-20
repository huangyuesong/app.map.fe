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
		};
	}

	_errorHandler (err) {
		alert(err);
	}

	_onLoginBtnClick (evt) {
		const url = `${config.energySystemURL}/mobileLoginIn`;
		let form = new FormData();
		form.append('username', this.state.username);
		form.append('password', this.state.password);

		fetch(url, {
			method: 'post',
			body: form,
		})
		.then((res)=> {
			return res.json();
		})
		.then((json)=> {
			if (json.success) {
				if (json.isAdministrator) {
					browserHistory.push(`/Management?username=${this.state.username}&password=${this.state.password}`);
				} else {
					browserHistory.push(`/Map?username=${this.state.username}&password=${this.state.password}`);
				}
			} else {
				this._errorHandler(json.errors);
			}
		})
		.catch((err)=> {
			this._errorHandler(err);
		});
	}

	_onResetBtnClick (evt) {
		this.refs.username.value = '';
		this.refs.password.value = '';
	}

	render () {
		return (
			<div className="login-page">
				<div className="login-wrapper">
					<h1>请登录</h1>

					<table className="login-tb">
						<tbody>
							<tr>
								<td className="label">
									<label htmlFor="username">用户名：</label>
								</td>
								<td>
									<input id="username" ref="username"
										onChange={(evt)=> this.setState({username: evt.target.value})} />
								</td>
							</tr>
							<tr>
								<td className="label">
									<label htmlFor="password">密码：</label>
								</td>
								<td>
									<input id="password" ref="password" type="password"
										onChange={(evt)=> this.setState({password: evt.target.value})} />
								</td>
							</tr>
						</tbody>
					</table>

					<div className="btn-wrapper">
						<button onClick={this._onLoginBtnClick.bind(this)}>登录</button>
						<button onClick={this._onResetBtnClick.bind(this)}>重置</button>
					</div>
				</div>
			</div>
		);
	}
}
