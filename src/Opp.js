import React, { Component } from 'react';
import axios from './Axios';
import Button from './Button';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		onlineUsers: state.onlineUsers
	};
};

class Opp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		axios
			.get('/user/' + this.props.match.params.id + '.json')
			.then((results) => {
				if (results.data.redirect) {
					this.props.history.push('/');
				} else {
					this.setState({
						userId: results.data.id,
						first_name: results.data.first_name,
						last_name: results.data.last_name,
						bio: results.data.bio,
						image: results.data.image || '/images/default.jpg',
						createdAt: results.data.created_at
					});
				}
			});
	}
	isUserOnline() {
		return this.props.onlineUsers.map((onlineUser) => {
			if (onlineUser.id == this.props.match.params.id) {
				return (
					<div className="dot">
						<p className="app-online-dot">•</p>
						<p className="app-online">online</p>
					</div>
				);
			} else if (!this.props.match.params.id) {
				return (
					<div className="dot">
						<p className="app-online-dot">•</p>
						<p className="app-online">offline</p>
					</div>
				);
			}
			<div key={onlineUser.id} />;
		});
	}

	render() {
		if (!this.props.onlineUsers) {
			return null;
		}
		return (
			<div className="app-profile-content">
				<div className="app-profile-photo">
					<img src={this.state.image} />;
					<div className="app-profile-info">
						<div className="app-username">
							<div className="app-city-online">
								<div className="city">
									<p className="app-city">
										Berlin, 23 years old
									</p>
								</div>
								<div className="dot">{this.isUserOnline()}</div>
							</div>
							<div className="app-username-first-last">
								<p className="app-username-font">
									{this.state.first_name}
								</p>
								<p className="app-username-font">
									{this.state.last_name}
								</p>
							</div>
						</div>
						<div className="app-userinfo">
							<p>{this.state.bio}</p>
						</div>

						<div className="bff-button">
							<Button otherUserId={this.props.match.params.id} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(Opp);
