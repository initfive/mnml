const spicedPg = require('spiced-pg');

//// HEROKU ////
let db;
if (process.env.DATABASE_URL) {
	db = spicedPg(process.env.DATABASE_URL);
} else {
	db = spicedPg('postgres:postgres:password@localhost:5432/socialnetwork');
}

exports.getRightEmail = function() {
	return db.query('SELECT * FROM users;').then((results) => {
		return results.rows;
	});
};

exports.updateUserProfilePic = function(imageUrl, userId) {
	const q = 'UPDATE users SET image = ($1) WHERE id = ($2) RETURNING *;';
	const params = [imageUrl, userId];
	return db.query(q, params).then((results) => {
		return results.rows[0].image;
	});
};

exports.updateImageboard = function(imageUrl, userId) {
	const q =
		'INSERT INTO imageboard (image_url, user_id) VALUES ($1, $2) RETURNING *;';
	const params = [imageUrl, userId];
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.getImageboard = function(user_id) {
	const q = 'SELECT * FROM imageboard WHERE user_id = $1;';
	const params = [user_id];
	return db.query(q, params).then((results) => {
		return results.rows;
	});
};

exports.registerNewUser = function(
	firstName,
	lastName,
	location,
	email,
	password
) {
	const q = `
        INSERT INTO users(first_name, last_name, location, email, hashed_password)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
    `;
	const params = [firstName, lastName, location, email, password];
	return db.query(q, params).then((results) => {
		// console.log(results.rows[0]);
		return results.rows[0];
	});
};

exports.getInfo = function(email) {
	const q = `SELECT email, hashed_password, id FROM users WHERE email= $1;`;
	const params = [email];
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.editBio = function(bio, id) {
	const params = [bio, id];
	const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING *;`;
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.addSong = function(song_title, song_url, user_id) {
	const params = [song_title, song_url, user_id];
	const q = `INSERT INTO playlist (song_title, song_url, user_id) VALUES ($1, $2, $3) RETURNING *;`;
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.getPlaylist = function(user_id) {
	const q = 'SELECT * FROM playlist WHERE user_id = $1;';
	const params = [user_id];
	return db.query(q, params).then((results) => {
		return results.rows;
	});
};

exports.getUserById = function(userId) {
	const q = 'SELECT * FROM users WHERE id = $1;';
	const params = [userId];
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.getFriendshipStatus = function(userId, bffId) {
	const q = `SELECT * FROM friendships WHERE ((receiver_id = $1 AND sender_id = $2) OR ( receiver_id = $2 AND sender_id = $1));`;
	const params = [userId, bffId];
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.createBff = function(userId, bffId) {
	const params = [userId, bffId];
	const q = `INSERT INTO friendships (sender_id, receiver_id, status) VALUES ($1, $2, 'pending');`;
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.cancelBff = function(userId, bffId) {
	const params = [userId, bffId];
	const q = `DELETE FROM friendships WHERE ((sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1));`;
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.makeBff = function(userId, bffId) {
	const params = [userId, bffId];
	const q = `
       UPDATE friendships
       SET status = 'friends'
       WHERE ((sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1));
       `;
	return db.query(q, params).then((results) => {
		return results.rows[0];
	});
};

exports.listOfFriends = function(userId) {
	const params = [userId];
	const q = `
           SELECT users.id, first_name, last_name, image, status
           FROM friendships
           JOIN users
           ON (status = 'pending' AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 'friends' AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 'friends' AND sender_id = $1 AND receiver_id = users.id);
       `;
	return db.query(q, params).then((results) => {
		return results.rows;
	});
};

exports.getUsersByIds = function(arrayOfIds) {
	const query = `SELECT * FROM users WHERE id = ANY($1)`;
	return db.query(query, [arrayOfIds]).then((results) => {
		return results.rows;
	});
};

exports.joinById = function(userId) {
	const query = `SELECT * FROM users WHERE id = $1`;
	return db.query(query, [userId]).then((results) => {
		return results.rows[0];
	});
};
