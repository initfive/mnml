export default function(state = {}, action) {
	if (action.type == 'RECIEVE_FRIENDS_WANNABES') {
		console.log('ACTION: ', action);
		state = {
			...state,
			users: action.users
		};
	}

	if (
		action.type == 'ACCEPT_FRIEND_REQUEST' ||
		action.type == 'END_FRIENDSHIP'
	) {
		console.log('action: ', state.users);
		state = {
			...state,
			users: state.users.map((user) => {
				// console.log("user: ", user);
				if (
					user.id == action.id &&
					action.type == 'ACCEPT_FRIEND_REQUEST'
				) {
					console.log('getting into first if');
					return {
						...user,
						friends: action.type == 'ACCEPT_FRIEND_REQUEST',
						status: 'friends'
					};
				} else if (
					user.id == action.id &&
					action.type == 'END_FRIENDSHIP'
				) {
					return {
						...user,
						not: action.type == 'END_FRIENDSHIP',
						status: 'no friendship'
					};
				} else {
					return user;
				}
			})
		};
	}

	if (action.type == 'ONLINE_USERS') {
		state = {
			...state,
			onlineUsers: action.users
		};
	}

	if (action.type == 'USER_JOINED') {
		state = {
			...state,
			onlineUsers: [action.user, ...state.onlineUsers]
		};
	}

	if (action.type == 'USER_LEFT') {
		state = {
			...state,
			onlineUsers: state.onlineUsers.filter(
				(user) => user.id != action.user.id
			)
		};
	}

	if (action.type == 'NEW_MESSAGE') {
		state = {
			...state,
			messages: [...state.messages, action.message]
		};
	}

	if (action.type == 'RECENT_MESSAGES') {
		state = {
			...state,
			messages: action.messages
		};
	}

	console.log('state: ', state);
	return state;
}
