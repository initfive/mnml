import React from 'react';
import Logo from './Logo';
import axios from './Axios';
import ReactDOM from 'react-dom';
import Registration from './Registration';
import Welcome from './Welcome';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { init } from './socket';

const store = createStore(
	reducer,
	composeWithDevTools(applyMiddleware(reduxPromise))
);

const elem = (init(store),
(
	<Provider store={store}>
		<App />
	</Provider>
));

ReactDOM.render(elem, document.querySelector('main'));

location.pathname === '/welcome'
	? ReactDOM.render(<Welcome />, document.querySelector('main'))
	: ReactDOM.render(elem, document.querySelector('main'));
