import React from 'react';
import axios from './Axios';

export async function receiveFriendsWannabes() {
	const { data } = await axios.get('/wannabees-friends');
	console.log('DATA ', data);
	return {
		type: 'RECIEVE_FRIENDS_WANNABES',
		users: data.results
	};
}

export async function acceptFriendRequest(id) {
	const x = await axios.post(`/friendships/make-bff/${id}`);
	return {
		type: 'ACCEPT_FRIEND_REQUEST',
		id
	};
}

export async function endFriendship(id) {
	const x = await axios.post(`/friendships/cancel-bff/${id}`);
	return {
		type: 'END_FRIENDSHIP',
		id
	};
}

// ONLINE USERS EXPORT FUNCTIONS (JOINED / LEFT)
export function userJoined(user) {
	return {
		type: 'USER_JOINED',
		user
	};
}
export function onlineUsers(users) {
	console.log('actions', users);
	return {
		type: 'ONLINE_USERS',
		users
	};
}
export function userLeft(user) {
	return {
		type: 'USER_LEFT',
		user
	};
}

export function newMessage(message) {
	return {
		type: 'NEW_MESSAGE',
		message
	};
}

export function recentMessages(messages) {
	return {
		type: 'RECENT_MESSAGES',
		messages
	};
}
