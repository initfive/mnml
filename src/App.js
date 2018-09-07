import React from 'react';
import Logo from './Logo';
import axios from './Axios';
import Uploader from './uploader';
import Profile from './Profile';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Opp from './Opp';
import Friends from './Friends';
import OnlineUsers from './OnlineUsers';
import Logout from './Logout';
import Chat from './Chat';
import AudioPlayer from './Audio';
import CustomAudioPlayer from './CustomAudio';
import UploaderImageboard from './UploaderImageboard';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showBio: false,
			showSongUploader: false,
			error: null,
			friendsIsVisible: false,
			hambiIsVisible: false,
			chatIsVisible: false,
			counter: 0,
			uploadImageboard: false,
			imageboardList: []
		};

		this.showUploader = this.showUploader.bind(this);
		this.setImage = this.setImage.bind(this);
		this.showFriends = this.showFriends.bind(this);
		this.hideFriends = this.hideFriends.bind(this);
		this.hideHambi = this.hideHambi.bind(this);
		this.showHambi = this.showHambi.bind(this);
		this.showChat = this.showChat.bind(this);
		this.showSearch = this.showSearch.bind(this);
		this.toggleShowBio = this.toggleShowBio.bind(this);
		this.setBio = this.setBio.bind(this);
		this.toggleSongUploader = this.toggleSongUploader.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.counter = this.counter.bind(this);
		this.counterPrevious = this.counterPrevious.bind(this);
		this.uploadImageboard = this.uploadImageboard.bind(this);
		this.setImageboard = this.setImageboard.bind(this);
	}

	counter() {
		if (this.state.counter >= this.state.userPlaylist.length - 1) {
			this.setState({ counter: 0 });
		} else {
			this.setState({ counter: this.state.counter + 1 }, () => {});
		}
	}

	counterPrevious() {
		console.log('string on prev');
		if (this.state.counter == 0) {
			this.setState({ counter: this.state.userPlaylist.length - 1 });
		} else {
			this.setState({ counter: this.state.counter - 1 });
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		axios.post('/uploadSong', { song: this.state }).then((results) => {
			console.log('song results', results.data);
			this.setState({ showSongUploader: false });
		});
	}

	showUploader() {
		this.setState({
			uploaderIsVisible: !this.state.uploaderIsVisible
		});
	}

	showFriends(e) {
		e.stopPropagation();

		this.setState({
			friendsIsVisible: !this.state.friendsIsVisible
		});
	}

	showChat() {
		this.setState({
			chatIsVisible: !this.state.chatIsVisible
		});
	}

	showSearch() {
		this.setState({
			searchIsVisible: !this.state.searchIsVisible
		});
	}

	showHambi(e) {
		e.stopPropagation();

		this.setState({
			hambiIsVisible: !this.state.hambiIsVisible
		});
	}

	uploadImageboard(e) {
		e.stopPropagation();

		this.setState({
			uploadImageboardIsVisible: !this.state.uploadImageboardIsVisible
		});
	}

	setImage(url) {
		this.setState({
			image: url,
			uploaderIsVisible: false
		});
	}

	setImageboard(imageData) {
		this.state.imageboardList.push(imageData);
		this.setState({
			imageboardList: this.state.imageboardList,
			uploadImageboardIsVisible: false
		});
	}

	hideFriends() {
		this.setState({
			friendsIsVisible: false
		});
	}

	hideHambi() {
		this.setState({
			hambiIsVisible: false
		});
	}

	hideChat() {
		this.setState({
			chatIsVisible: false
		});
	}

	hideHambi() {
		this.setState({
			hambiIsVisible: false
		});
	}

	setBio(bio) {
		this.setState({
			bio: bio
		});
	}

	toggleShowBio() {
		this.setState({
			showBio: !this.state.showBio
		});
	}

	toggleSongUploader() {
		this.setState({
			showSongUploader: !this.state.showSongUploader
		});
	}

	handlePropagation(e) {
		e.stopPropagation();
	}

	componentDidMount() {
		axios.get('/user').then((results) => {
			this.setState({
				userId: results.data.id,
				firstName: results.data.first_name,
				lastName: results.data.last_name,
				location: results.data.location,
				image: results.data.image || '/images/default.jpg',
				bio: results.data.bio
			});
		});

		axios.get('/getPlaylist').then((results) => {
			this.setState({
				userPlaylist: results.data.results
			});
		});

		axios.get('/getImageboard').then((results) => {
			console.log('maybe i am wrong', results.data.results);
			this.setState({
				imageboardList: results.data.results
			});
		});
	}

	render() {
		if (!this.state.userId) {
			return (
				<div>
					<p className="app-username-font">Loading..</p>
				</div>
			);
		}

		return (
			<div onClick={this.hideFriends}>
				<BrowserRouter>
					<div>
						<div className="bodydiv">
							<div className="app-header">
								<Logo />
								<div id="closedSearch">
									<input
										id="srh"
										type="search"
										placeholder="Search.."
									/>
								</div>
								<div
									onClick={this.showSearch}
									style={{
										backgroundColor: this.state
											.searchIsVisible
											? '#0b6d98'
											: '#34ace0',
										border: this.state.searchIsVisible
											? '1px darkgray solid'
											: 'none'
									}}
									value="Housing"
									id="searchDiv"
								>
									<img
										id="search-logo"
										src="/magnifying-glass (4).png"
									/>
								</div>
								<div
									value="Housing"
									id="friendsDiv"
									onClick={this.showFriends}
									style={{
										backgroundColor: this.state
											.friendsIsVisible
											? '#0b6d98'
											: '#0986bc',
										border: this.state.friendsIsVisible
											? '1px darkgray solid'
											: 'none'
									}}
								>
									<img
										id="friends-logo"
										src="/add-user-button (1).png"
									/>
								</div>
								<div
									id="loginDiv"
									onClick={this.showHambi}
									style={{
										backgroundColor: this.state
											.hambiIsVisible
											? '#404040'
											: '#202020',
										border: this.state.hambiIsVisible
											? '1px lightgray solid'
											: 'none'
									}}
								>
									<img id="hambi" src="/justify.png" />
								</div>
							</div>

							<div className="main">
								<div className="navigation">
									<img
										className="nav-ico"
										src="/id-card.png"
									/>
									<img className="nav-ico" src="/mail.png" />
									<img
										onClick={this.showChat}
										className="nav-ico"
										src="/speech-bubble.png"
									/>
								</div>
								<Route
									exact
									path="/"
									render={() => (
										<Profile
											firstName={this.state.firstName}
											lastName={this.state.lastName}
											location={this.state.location}
											profilePic={this.state.image}
											bio={this.state.bio}
											showBio={this.state.showBio}
											toggleShowBio={this.toggleShowBio}
											setBio={this.setBio}
											showUploader={this.showUploader}
										/>
									)}
								/>
								<Route exact path="/user/:id" component={Opp} />
								{this.state.friendsIsVisible && (
									<div onClick={this.handlePropagation}>
										<Friends
											hideFriends={this.hideFriends}
										/>
									</div>
								)}
								{this.state.hambiIsVisible && <Logout />}
							</div>
							<div className="social-content">
								<div className="wall">
									<div className="music-player">
										<Route
											exact
											path="/"
											render={() => (
												<CustomAudioPlayer
													userPlaylist={
														this.state.userPlaylist
													}
													counter={this.counter}
													counterPrevious={
														this.counterPrevious
													}
													currentSong={
														this.state.counter
													}
												/>
											)}
										/>
									</div>
									<div className="playlist">
										<div className="song-titles-div">
											{this.state.userPlaylist &&
												this.state.userPlaylist.map(
													(song) => (
														<div key={song.id}>
															<p>
																{
																	song.song_title
																}
															</p>
														</div>
													)
												)}
										</div>
										<div className="song-edit-space">
											{!this.state.showSongUploader && (
												<p
													className="add-song-text"
													onClick={
														this.toggleSongUploader
													}
												>
													<b>+</b> Add new song
												</p>
											)}

											{this.state.showSongUploader && (
												<form
													onSubmit={this.handleSubmit}
													className="add-song-form"
												>
													<input
														className="input-song"
														name="songTitle"
														onChange={
															this.handleChange
														}
														placeholder="Song name"
													/>
													<input
														className="input-song"
														name="songUrl"
														onChange={
															this.handleChange
														}
														placeholder="<br></br>Song Url"
													/>
													<button
														className="input-song-button"
														type="submit"
													>
														Add new song
													</button>
												</form>
											)}
										</div>
									</div>
									{this.state.chatIsVisible && (
										<div className="main-chat-div">
											<OnlineUsers />
											<Chat />
										</div>
									)}
									<div className="wall-content">
										<div className="main-photo">
											{this.state.imageboardList &&
												this.state.imageboardList.map(
													(image) => (
														<div id="image">
															<img
																className="img-ins"
																src={
																	image.image_url
																}
															/>
														</div>
													)
												)}
										</div>
										<div
											className="like-div"
											onClick={this.uploadImageboard}
										>
											<img
												id="imageboard-uploader-logo"
												src="camera.png"
												onClick={this.uploadImageboard}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="footer">
								<div className="empty" />
								<div className="end" />
							</div>
						</div>
						{this.state.uploaderIsVisible && (
							<div id="modal" onClick={this.showUploader}>
								<div
									className="no-modal"
									onClick={this.handlePropagation}
								>
									<Uploader setImage={this.setImage} />
								</div>
							</div>
						)}

						{this.state.uploadImageboardIsVisible && (
							<div
								id="modal-imageboard"
								onClick={this.uploadImageboard}
							>
								<div
									className="no-modal-imageboard"
									onClick={this.handlePropagation}
								>
									<UploaderImageboard
										setImageboardImage={this.setImageboard}
									/>
								</div>
							</div>
						)}
					</div>
				</BrowserRouter>
			</div>
		);
	}
}
