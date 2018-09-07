import React, { Component } from 'react';
import axios from './Axios';
import Logo from './Logo';
import Registration from './Registration';
import { Link } from 'react-router-dom';
import App from './App';

class Login extends Component {
	constructor() {
		super();

		this.state = { error: null };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState(
			{
				[e.target.name]: e.target.value
				//review es6 dinamic properties
			},
			() => {
				console.log(this.state);
			}
		);
	}

	handleSubmit(e) {
		e.preventDefault();

		console.log('Running handleSubmit', this.state);
		axios
			.post('/login', this.state)
			.then((res) => {
				console.log('res data er', res.data.error);
				if (res.data.error) {
					this.setState({
						error: res.data.error
					});
				} else {
					location.replace('/');
				}
			})
			.catch((err) => console.log('error on catch', err));
	}

	render() {
		return (
			<div className="bodydiv">
				<div className="header">
					<div className="left-header">
						<Logo />
					</div>
					<div className="right-header">
						<div className="login-nav">
							<h3 id="login-font">LOGIN</h3>
						</div>
						<Link to="./">
							<div id="login-link-div">
								<h3 id="login-font">SIGN UP</h3>
							</div>
						</Link>
					</div>
				</div>
				<div className="main-everything">
					<div className="main-login">
						<div className="center">
							<form
								className="login-form"
								onSubmit={this.handleSubmit}
							>
								{this.state.error ? (
									<div className="errordiv">
										{' '}
										{this.state.error}{' '}
									</div>
								) : null}
								<h3 className="register">Login</h3>
								<input
									className="inp-log"
									onChange={this.handleChange}
									placeholder="Email"
									type="text"
									name="email"
								/>
								<input
									className="inp-log"
									onChange={this.handleChange}
									placeholder="Password"
									type="password"
									name="password"
								/>
								<button className="login-submit" type="submit">
									Submit
								</button>
								<p>
									If you are not a member, please&nbsp;
									<Link to="./" className="signup-a">
										Register.
									</Link>
								</p>
							</form>
						</div>{' '}
					</div>

					<Link to="./">
						<div className="black-line" />
					</Link>
				</div>
			</div>
		);
	}
}

export default Login; //export default no currly brackets
