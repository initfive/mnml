import React from 'react';
import App from './App';

function ProfilePic({ image, first, last, clickHandler }) {
	return (
		<img
			className="profile-pic"
			src={image}
			alt={`${first} ${last}`}
			onClick={clickHandler}
		/>
	);
}
export default ProfilePic;
