import React from 'react';
import { connect } from 'react-redux';
import {
	receiveFriendsWannabes,
	acceptFriendRequest,
	endFriendship
} from './actions';

const mapStateToProps = (state) => {
	return {
		friends:
			state.users && state.users.filter((f) => f.status == 'friends'),
		pending: state.users && state.users.filter((f) => f.status == 'pending')
	};
};

class Friends extends React.Component {
	componentDidMount() {
		this.props.dispatch(receiveFriendsWannabes());
	}
	render() {
		const { friends, pending } = this.props;
		console.log('WHAA', friends);
		if (!friends && !pending) {
			return null;
		}

		const handleFriendClick = (wannabee) => {
			this.props.dispatch(acceptFriendRequest(wannabee.id));
		};

		const handleUnfriendClick = (friend) => {
			this.props.dispatch(endFriendship(friend.id));
		};

		return (
			<div className="margin-div">
				<div>
					<div className="friends-rendered">
						{friends.map((friend) => (
							<div key={friend.id} className="single-friend">
								<img
									className="single-friend-pic"
									src={friend.image}
								/>
								<div className="friend-request-names">
									<p className="friend-color-names">
										{friend.first_name}
									</p>
									<p className="friend-color-names">
										{friend.last_name}
									</p>
								</div>
								<div className="button-request">
									<button
										className="unfriend-friend-button"
										onClick={(e) =>
											handleUnfriendClick(friend)
										}
									>
										Unfriend
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="friends-rendered">
						{pending.map((wannabee) => (
							<div key={wannabee.id} className="single-friend">
								<img
									className="single-friend-pic"
									src={wannabee.image}
								/>
								<div className="friend-request-names">
									<p className="friend-color-names">
										{wannabee.first_name}
									</p>
									<p className="friend-color-names">
										{wannabee.last_name}
									</p>
								</div>
								<div className="button-request">
									<button
										className="unfriend-friend-button"
										onClick={(e) =>
											handleFriendClick(wannabee)
										}
									>
										Add as a friend
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="blackspace" />
			</div>
		);
	}
}

export default connect(mapStateToProps)(Friends);
