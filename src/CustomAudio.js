import React from 'react';
import ReactDOM from 'react-dom';
import {
	PlayButton,
	Timer,
	VolumeControl,
	NextButton,
	PrevButton,
	Cover,
	Progress
} from 'react-soundplayer/components';

// it's just an alias for `withSoundCloudAudio` but makes code clearer
import { withCustomAudio } from 'react-soundplayer/addons';

// audio source
const streamUrl = '';

// some track meta information
const trackTitle = '';

const AWSSoundPlayer = withCustomAudio((props) => {
	const { trackTitle } = props;
	console.log('props sc', props);

	return (
		<div className="music-player-constols">
			<div className="music-player-first-row">
				<div className="music-player-first">
					<h4>{trackTitle}</h4>
				</div>
				<div className="music-player-second">
					<Timer
						duration={props.duration || 0}
						currentTime={props.currentTime}
						{...props}
					/>
				</div>
			</div>
			<div className="music-player-progress-row">
				<div className="music-player-progess">
					<Progress {...props} />
				</div>
			</div>
			<div className="music-player-second-row">
				<div className="music-player-first">
					<PlayButton {...props} />
					<PrevButton
						{...props}
						onPrevClick={() => {
							props.counterPrevious();
						}}
					/>
					<NextButton
						{...props}
						onNextClick={() => {
							props.soundCloudAudio._track.stream_url =
								props.streamUrl;
							props.counter();
						}}
						soundCloudAudio={null}
					/>
				</div>
				<div className="music-player-second">
					<VolumeControl {...props} />
				</div>
			</div>
		</div>
	);
});

class CustomAudioPlayer extends React.Component {
	componentDidUpdate(prevProps) {
		if (this.props.streamUrl !== prevProps.streamUrl) {
			this.props.soundCloudAudio.preload(this.props.streamUrl);
			this.props.soundCloudAudio.play();
		}
	}

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		anytext: 'anything',
	// 		userPlaylist: this.props.userPlaylist,
	// 		currentSong: this.props.currentSong,
	// 		counter: this.props.counter,
	// 		counterPrevious: this.props.counterPrevious
	// 	};
	// 	console.log('custom audio player THISSSS ONE', this.state);
	// }
	// componentWillMount() {
	// 	this.setState(
	// 		{
	// 			userPlaylist: this.props.userPlaylist,
	// 			currentSong: this.props.currentSong,
	// 			counter: this.props.counter,
	// 			counterPrevious: this.props.counterPrevious
	// 		},
	// 		() => {}
	// 	);
	// 	console.log('reach meeeee', this.state);
	// }

	render() {
		if (!this.props.userPlaylist) {
			return (
				<div>
					<p className="app-username-font">Loading..</p>
				</div>
			);
		}
		var components = this.props.userPlaylist.map((userPlaylist) => {
			return (
				<AWSSoundPlayer
					{...this.props}
					streamUrl={userPlaylist.song_url}
					trackTitle={userPlaylist.song_title}
					preloadType="auto"
				/>
			);
		});

		var component = components[this.props.currentSong];
		console.log('this props', this.props.currentSong);
		return <div>{component}</div>;
	}
}

export default CustomAudioPlayer;
