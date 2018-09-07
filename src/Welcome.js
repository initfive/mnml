import React from 'react';
import Registration from './Registration';
import { HashRouter, Route } from 'react-router-dom';
import Login from './Login';

function Welcome() {
	return (
		<HashRouter>
			<div>
				<Route exact path="/" component={Registration} />
				<Route path="/login" component={Login} />
			</div>
		</HashRouter>
	);
}

export default Welcome;
