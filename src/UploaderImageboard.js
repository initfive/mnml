import React, { Component } from 'react';
import axios from './Axios';

class UploaderImageboard extends Component {
	constructor(props) {
		super(props);
		this.imageBoardList = [];

		this.imageSelected = this.imageSelected.bind(this);
		this.uploadImageboard = this.uploadImageboard.bind(this);
	}

	imageSelected(e) {
		this.setState({
			imageFile: e.target.files[0]
		});
	}

	uploadImageboard() {
		var formData = new FormData();
		formData.append('file', this.state.imageFile);
		console.log('going up', this.state);
		axios.post('/uploadImageboard', formData).then((res) => {
			console.log('image url ', res.data);
			this.props.setImageboardImage(res.data);
		});
	}

	render() {
		return (
			<div className="image-uploader">
				<label htmlFor="input-file-field" className="file-field">
					Add new image
				</label>
				<input
					type="file"
					id="input-file-field"
					onChange={this.imageSelected}
				/>
				<button
					className="upload-button"
					onClick={this.uploadImageboard}
				>
					<b>+</b> Upload image to your wall
				</button>
			</div>
		);
	}
}

export default UploaderImageboard;
