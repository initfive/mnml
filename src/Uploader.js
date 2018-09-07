import React, { Component } from 'react';
import axios from './Axios';
import ProfilePic from './profilepic';

class Uploader extends Component {
	constructor(props) {
		super(props);

		this.imageSelected = this.imageSelected.bind(this);
		this.upload = this.upload.bind(this);
	}

	imageSelected(e) {
		this.setState({
			imageFile: e.target.files[0]
		});
	}

	upload() {
		var formData = new FormData();
		formData.append('file', this.state.imageFile);

		axios.post('/upload', formData).then((res) => {
			this.props.setImage(res.data.imageUrl);
		});
	}

	render() {
		return (
			<div className="image-uploader">
				<label htmlFor="input-file-field" className="file-field">
					Change profile picture
				</label>
				<input
					type="file"
					id="input-file-field"
					onChange={this.imageSelected}
				/>
				<button className="upload-button" onClick={this.upload}>
					+ Upload
				</button>
			</div>
		);
	}
}

export default Uploader;
