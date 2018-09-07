import React, { Component } from 'react';
import ProfilePic from './profilepic';
import axios from './Axios';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bio: this.props.bio,
			error: null
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
			//review es6 dinamic properties
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		axios.post('/uploadBio', { bio: this.state.bio }).then(() => {
			this.props.setBio(this.state.bio);
			this.props.toggleShowBio();
		});
	}

	render() {
		const {
			firstName,
			lastName,
			location,
			profilePic,
			bio,
			showBio,
			toggleShowBio,
			setBio,
			showUploader
		} = this.props;

		return (
			<div className="app-profile-content">
				<div className="app-profile-photo">
					<ProfilePic
						image={profilePic}
						first={firstName}
						last={lastName}
						clickHandler={showUploader}
					/>
					<div className="app-profile-info">
						<div className="app-username">
							<div className="app-city-online">
								<div className="city">
									<p className="app-city">{location}</p>
								</div>
								<div className="dot">
									<p className="app-online-dot">•</p>
									<p className="app-online">online</p>
								</div>
							</div>
							<div className="app-username-first-last">
								<p className="app-username-font">{firstName}</p>
								<p className="app-username-font">{lastName}</p>
							</div>
						</div>
						<div className="app-userinfo">
							{!bio && !showBio ? (
								<p
									className="edit-text"
									onClick={toggleShowBio}
								>
									<b>+</b> Click to add your bio
								</p>
							) : null}

							{bio && !showBio ? (
								<div>
									<p className="bio-text"> {bio} </p>
									<p
										className="edit-text"
										onClick={toggleShowBio}
									>
										<b>+</b> Edit signature
									</p>
								</div>
							) : null}

							{showBio ? (
								<form onSubmit={this.handleSubmit}>
									<textarea
										onChange={this.handleChange}
										name="bio"
										defaultValue={bio}
									/>
									<button type="submit"> Save </button>
								</form>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;

//turnary operators and conditional rendering in react
