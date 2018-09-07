import React from 'react';
import { connect } from 'react-redux';

function Logout() {
	return (
		<div className="hamburger-menu">
			<div className="hambi-dropdown">
				<form className="hambi-form-dropdown" action="/logout">
					<button
						className="unfriend-friend-button"
						type="submit"
						value="Logout"
					>
						Log Out
					</button>
				</form>
				<form className="hambi-form-dropdown" action="/delete">
					<button
						className="delete-account-button"
						type="submit"
						value="Delete"
					>
						Delete Account
					</button>
				</form>
			</div>
		</div>
	);
}

export default Logout;
