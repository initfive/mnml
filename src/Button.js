import React from 'react';
import axios from './Axios';

export default class Button extends React.Component {
	constructor() {
		super();
		this.state = {};

		this.getButtonText = this.getButtonText.bind(this);
		this.updateFriendship = this.updateFriendship.bind(this);
	}

	componentDidMount() {
		// console.log('OUI', this.props.otherUserId);
		axios.get('/friendships/' + this.props.otherUserId).then((results) => {
			console.log('friend: ', results);
			if (Object.keys(results.data).length == 0) {
				console.log('yooooooo');
				this.setState({
					status: 'no friendship'
				});
			} else if (results.data.status == 'pending') {
				console.log('pendingguy', results);
				this.setState(
					{
						status: 'pending',
						receiverId: results.data.receiver_id
					},
					() => console.log('state after update: ', this.state)
				);
			} else if (results.data.status == 'friends') {
				this.setState({
					status: 'friends'
				});
			}
		});
	}

	updateFriendship() {
		if (this.getButtonText() == 'SEND FRIEND REQUEST') {
			axios
				.post('/friendships/pending/' + this.props.otherUserId)
				.then((results) => {
					console.log('pending');
					console.log('WHAT IS IN RESULTS: ', results);
					if (results.data.success) {
						this.setState({
							status: 'pending',
							receiverId: this.props.otherUserId
						});
					}
				});
		} else if (this.getButtonText() == 'CANCEL FRIEND REQUEST') {
			axios
				.post('/friendships/cancel-bff/' + this.props.otherUserId)
				.then((results) => {
					if (results.data.success) {
						this.setState({ status: 'no friendship' });
					}
				});
		} else if (this.getButtonText() == 'ACCEPT') {
			axios
				.post('/friendships/make-bff/' + this.props.otherUserId)
				.then((results) => {
					if (results.data.success) {
						this.setState({ status: 'friends' });
					}
				});
		} else if (this.getButtonText() == 'STOP FRIENDSHIP') {
			axios
				.post('/friendships/cancel-bff/' + this.props.otherUserId)
				.then((results) => {
					if (results.data.success) {
						this.setState({ status: 'no friendship' });
					}
				});
		}
	}

	getButtonText() {
		if (this.state.status == 'no friendship') {
			return 'SEND FRIEND REQUEST';
		} else if (this.state.status == 'pending') {
			if (this.state.receiverId == this.props.otherUserId) {
				return 'CANCEL FRIEND REQUEST';
			} else {
				return 'ACCEPT';
			}
		} else if (this.state.status == 'friends') {
			return 'STOP FRIENDSHIP';
		}
	}

	render() {
		return (
			<button onClick={this.updateFriendship}>
				{this.getButtonText()}
			</button>
		);
	}
}
