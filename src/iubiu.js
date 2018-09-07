import React, { Component } from 'react';
import ClassNames from 'classnames';
import { withCustomAudio } from 'react-soundplayer/addons';
import {
	PlayButton,
	Timer,
	VolumeControl,
	NextButton,
	PrevButton,
	Progress
} from 'react-soundplayer/components';

class App extends Component {
	constructor() {
		super();

		this.state = {
			tracks: [
				{
					id: 1,
					name: 'Ksmtk - Reborn',
					src:
						'https://labs.voronianski.com/react-soundplayer-examples/ksmtk-reborn-edit.mp3'
				},
				{
					id: 2,
					name: 'H A G H O R R O R - Accelerator',
					src:
						'https://labs.voronianski.com/react-soundplayer-examples/haghorror-accelerator-edit.mp3'
				}
			],
			playingIndex: 0
		};
	}

	nextTrack() {
		let { playingIndex, tracks } = this.state;

		if (playingIndex >= tracks.length - 1) {
			return;
		}

		if (playingIndex || playingIndex === 0) {
			this.setState({ playingIndex: ++playingIndex });
		}
	}

	prevTrack() {
		let { playingIndex } = this.state;

		if (playingIndex <= 0) {
			return;
		}

		if (playingIndex || playingIndex === 0) {
			this.setState({ playingIndex: --playingIndex });
		}
	}

	selectTrack(trackIndex) {
		this.setState({ playingIndex: trackIndex });
	}

	render() {
		const { tracks, playingIndex } = this.state;
		const currentTrack = tracks[playingIndex];

		return (
			<div className="container">
				<h2>React-Soundplayer Custom Playlist Audio</h2>
				<CustomPlayer
					title="🎵 Custom Playlist Title"
					tracks={tracks}
					playingIndex={playingIndex}
					streamUrl={currentTrack.src}
					trackTitle={currentTrack.name}
					onPrev={() => this.prevTrack()}
					onNext={() => this.nextTrack()}
					onSelect={(i) => this.selectTrack(i)}
				/>
			</div>
		);
	}
}

class _CustomPlayer extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.streamUrl !== prevProps.streamUrl) {
			this.props.soundCloudAudio.preload(this.props.streamUrl);
			this.props.soundCloudAudio.play();
		}
	}

	render() {
		return (
			<div className="bg-darken-1 red mt1 mb3 rounded">
				<div className="p2">
					<div className="flex flex-center mb1">
						<h2 className="h4 flex-auto nowrap m0 semibold">
							{this.props.title}
						</h2>
						<Timer
							className="h6 mr1 regular"
							duration={this.props.duration || 0}
							currentTime={this.props.currentTime}
							{...this.props}
						/>
					</div>
					<div className="flex flex-center">
						<PrevButton
							className="flex-none h3 button button-narrow button-transparent button-grow rounded"
							onPrevClick={() => this.props.onPrev()}
						/>
						<PlayButton
							className="flex-none h2 button button-transparent button-grow rounded"
							{...this.props}
						/>
						<NextButton
							className="flex-none h3 button button-narrow button-transparent button-grow rounded"
							onNextClick={() => this.props.onNext()}
						/>
						<VolumeControl
							className="flex flex-center mr2"
							buttonClassName="flex-none h4 button button-transparent button-grow rounded"
							{...this.props}
						/>
						<Progress
							className="mt1 mb1 rounded"
							innerClassName="rounded-left"
							value={
								(this.props.currentTime / this.props.duration) *
									100 || 0
							}
							{...this.props}
						/>
					</div>
				</div>

				<div>
					{this.props.tracks.map((track, index) => {
						const classNames = ClassNames(
							'flex flex-center full-width left-align button button-transparent',
							{
								'is-active': index === this.props.playingIndex
							}
						);

						return (
							<button
								key={track.id}
								className={classNames}
								onClick={() => this.props.onSelect(index)}
							>
								<span className="flex-auto semibold">
									{track.name}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		);
	}
}
const CustomPlayer = withCustomAudio(_CustomPlayer);

export default App;
