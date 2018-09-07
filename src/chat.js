import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { emitChatMessage } from './socket';
import axios from './axios';

const mapStateToProps = (state) => {
	return {
		newChatMsg: state.messages
	};
};

class Chat extends React.Component {
	constructor() {
		super();
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		e.preventDefault();
		emitChatMessage(this.state.chatMessage);
		document.querySelector('.input-chat-box').value = '';
		this.setState({ chatMessage: null });
	}

	handleChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	componentDidUpdate() {
		this.elem.scrollTop = this.elem.scrollHeight;
	}

	render() {
		const { newChatMsg } = this.props;
		console.log('this props: ', this.props);
		if (!newChatMsg) {
			return null;
		}

		return (
			<div className="chat-box">
				<div
					className="chat-box-text"
					ref={(elem) => (this.elem = elem)}
				>
					{newChatMsg.map((message, i) => {
						return (
							<div key={i} className="message">
								<div className="online-user-chat">
									<div className="chat-user-name">
										{message.firstName}:
									</div>
									<div className="chat-bubble">
										{message.content}
									</div>
								</div>
								<div className="chat-date">{message.date}</div>
							</div>
						);
					})}
				</div>
				<div className="chat-div-area">
					<form className="chat-form-area">
						<input
							onChange={(e) => this.handleChange(e)}
							name="chatMessage"
							type="text"
							placeholder="Start typing..."
							className="input-chat-box"
						/>
						<button
							onClick={(e) => this.handleClick(e)}
							type="submit"
							className="form-button"
						>
							Send
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps)(Chat);
