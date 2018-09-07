import React, { Component } from 'react';
import axios from './Axios';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import Login from './Login';

class Registration extends Component {
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
		axios.post('/registration', this.state).then((res) => {
			console.log('res data er', res.data.error);
			if (res.data.error) {
				this.setState({
					error: res.data.error
				});
			} else {
				location.replace('/');
			}
		});
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
							<h3 id="login-font">
								<Link to="./Login">LOGIN</Link>
							</h3>
						</div>
						<div id="signup-div">
							<h3 id="login-font">SIGN UP</h3>
						</div>
					</div>
				</div>
				<div className="main-signup">
					<div className="center">
						<form
							className="login-form"
							onSubmit={this.handleSubmit}
						>
							{this.state.error ? (
								<div className="errordiv">
									{this.state.error}
								</div>
							) : null}
							<h3 className="register">Create a new account</h3>
							<input
								onChange={this.handleChange}
								placeholder="First Name"
								type="text"
								name="firstName"
							/>
							<input
								onChange={this.handleChange}
								placeholder="Last Name"
								type="text"
								name="lastName"
							/>
							<input
								onChange={this.handleChange}
								placeholder="Location"
								type="text"
								name="location"
							/>
							<input
								onChange={this.handleChange}
								placeholder="Email"
								type="text"
								name="email"
							/>
							<input
								onChange={this.handleChange}
								placeholder="Password"
								type="password"
								name="password"
							/>
							<button className="submit" type="submit">
								Submit
							</button>
							<p>
								If you are already a member, please&nbsp;
								<Link to="./Login" className="login-a">
									Login
								</Link>
								.
							</p>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Registration; //export default no currly brackets
