import React from 'react';
import axios from './Axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const mapStateToProps = (state) => {
	return {
		onlineUsers: state.onlineUsers
	};
};

class OnlineUsers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	createFriendsOnlineView(onlineUsers) {
		if (onlineUsers.length > 0) {
			return onlineUsers.map((onlineUsers) => (
				<div key={onlineUsers.id} className="online-user">
					<Link to={`/user/${onlineUsers.id}`}>
						<img
							className="online-user-pic"
							src={onlineUsers.image || '/default.png'}
						/>
					</Link>
					<Link className="a-name" to={`/user/${onlineUsers.id}`}>
						<p className="online-user-name">
							{onlineUsers.first_name} {onlineUsers.last_name}
						</p>
					</Link>
				</div>
			));
		}
		return <div className="no-friend-requests">No friends online</div>;
	}

	render() {
		if (!this.props.onlineUsers) {
			return null;
		}
		return (
			<div className="online-users-div">
				<p className="online-users-title">&nbsp;&nbsp;Online Users</p>
				<div className="extra-wrapper">
					{this.createFriendsOnlineView(this.props.onlineUsers)}
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(OnlineUsers);
