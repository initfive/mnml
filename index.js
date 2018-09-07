console.log('\x1Bc');
const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const db = require('./db/db.js');
const bc = require('./config/bcrypt');
const csurf = require('csurf');
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

var cookieSession = require('cookie-session');

//////////////////////////////////////////////////////////////////////
/////////////////////////////// Multer ///////////////////////////////
//////////////////////////////////////////////////////////////////////

const s3 = require('./s3');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const config = require('./config');

//////////////////////////////////////////////////////////////////////
///////////////////////////// Multer #2 //////////////////////////////
//////////////////////////////////////////////////////////////////////

const diskStorage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname + '/uploads');
	},
	filename: function(req, file, callback) {
		uidSafe(24).then(function(uid) {
			callback(null, uid + path.extname(file.originalname));
		});
	}
});

const uploader = multer({
	storage: diskStorage,
	limits: {
		fileSize: 2097152
	}
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const signedOutRedirect = (req, res, next) => {
	if (!req.session.user) {
		res.redirect('/welcome');
	} else {
		next();
	}
};

const cookieSessionMiddleware = cookieSession({
	secret: `I'm always angry.`,
	maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
	cookieSessionMiddleware(socket.request, socket.request.res, next);
});

////////////////////////////////////////////// axios aftr cookie session
app.use(csurf());

app.use(function(req, res, next) {
	res.cookie('mytoken', req.csrfToken());
	next();
});

////////////////////////////////////////////
app.use('/favicon.ico', (req, res) => {
	res.sendStatus(204);
});
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//

if (process.env.NODE_ENV != 'production') {
	app.use(
		'/bundle.js',
		require('http-proxy-middleware')({
			target: 'http://localhost:8081/'
		})
	);
} else {
	app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

function checkLogin(req, res, next) {
	if (!req.session.user) {
		res.redirect('/welcome');
	} else {
		next();
	}
}

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
	db.updateUserProfilePic(
		config.s3Url + req.file.filename,
		req.session.userId
	).then(() => {
		console.log('saljem server url: ', config.s3Url + req.file.filename);
		res.json({
			imageUrl: config.s3Url + req.file.filename
		});
	});
});

app.post(
	'/uploadImageboard',
	uploader.single('file'),
	s3.upload,
	(req, res) => {
		db.updateImageboard(
			config.s3Url + req.file.filename,
			req.session.userId
		).then((results) => {
			console.log('our resultzzz', results);
			res.json({
				...results
			});
		});
	}
);

app.get('/getImageboard', function(req, res) {
	db.getImageboard(req.session.userId).then((results) => {
		console.log('getImageboard: ', results);
		res.json({ results });
	});
});

app.post('/registration', (req, res) => {
	if (
		!req.body.firstName ||
		!req.body.lastName ||
		!req.body.location ||
		!req.body.email ||
		!req.body.password
	) {
		console.log(req.body);
		res.json({
			error: 'Please, insert valid information in all fields'
		});
		res.sendStatus(500);
		console.log('Error');
	} else {
		bc.hashPassword(req.body.password)
			.then((hashedPassword) => {
				db.registerNewUser(
					req.body.firstName,
					req.body.lastName,
					req.body.location,
					req.body.email,
					hashedPassword
				).then((newRegUser) => {
					// console.log(newUser);
					req.session.user = newRegUser;
					req.session.userId = newRegUser.id;

					console.log(newRegUser);
					res.json({ success: true });
				});
			})
			.catch((err) => {
				console.log(err);
				res.json({
					error: 'The email address already exists, try loging in.'
				});
			});
	}
});

app.post('/login', function(req, res) {
	var userInfo;
	if (!req.body.email || !req.body.password) {
		res.json({
			error: 'Please, fill all the fields.'
		});
	} else {
		db.getInfo(req.body.email).then((loggedUser) => {
			userInfo = loggedUser;
			if (loggedUser === undefined || loggedUser.length == 0) {
				//tracking user that he is loged in
				res.json({
					error: 'Email or password incorrect'
				});
			} else {
				let hashedPassword = loggedUser.hashed_password;
				bc.checkPassword(req.body.password, hashedPassword).then(
					(checked) => {
						if (checked) {
							req.session.user = loggedUser;
							req.session.userId = userInfo.id;
							res.json({
								success: true
							});
						} else {
							res.json({
								error: 'Email or password incorrect'
							});
						}
					}
				);
			}
		});
	}
});

app.post('/uploadBio', (req, res) => {
	db.editBio(req.body.bio, req.session.userId)
		.then(() => {
			res.end();
		})
		.catch((err) => {
			console.log('Edit bio error: ', err);
		});
});

app.post('/uploadSong', (req, res) => {
	db.addSong(
		req.body.song.songTitle,
		req.body.song.songUrl,
		req.session.userId
	)
		.then((results) => {
			res.json({
				results
			});
		})
		.catch((err) => {
			console.log('Playlist error: ', err);
		});
	// console.log('reg.body.song', req.body.song);
});

app.get('/getPlaylist', function(req, res) {
	// console.log('my user', req.session.userId);
	db.getPlaylist(req.session.userId).then((results) => {
		// console.log('my playlist results', results);
		res.json({ results });
	});
});

app.get('/welcome', function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.sendFile(__dirname + '/index.html');
	}
});

app.get('/friendships/:id', function(req, res) {
	db.getFriendshipStatus(req.session.userId, req.params.id).then(
		(results) => {
			res.json({
				...results
			});
		}
	);
});

app.post('/friendships/pending/:id', function(req, res) {
	db.createBff(req.session.userId, req.params.id).then((results) => {
		res.json({
			success: true
		});
	});
});

app.post('/friendships/cancel-bff/:id', function(req, res) {
	db.cancelBff(req.session.userId, req.params.id).then((results) => {
		res.json({
			success: true
		});
	});
});

app.post('/friendships/make-bff/:id', function(req, res) {
	db.makeBff(req.session.userId, req.params.id).then((results) => {
		res.json({
			success: true
		});
	});
});

app.get('/wannabees-friends', function(req, res) {
	db.listOfFriends(req.session.userId).then((results) => {
		res.json({ results });
	});
});

//od srijede makesureUserIsLogin
app.get('/user', checkLogin, function(req, res) {
	db.getUserById(req.session.userId)
		.then((results) => {
			res.json({
				...results
			});
		})
		.catch(() => res.sendStatus(500));
});

app.get('/user/:id.json', (req, res) => {
	if (req.session.userId == req.params.id) {
		res.json({
			redirect: '/'
		});
	} else {
		db.getUserById(req.params.id)
			.then((results) => {
				console.log('getting user info');
				res.json({
					...results
				});
			})
			.catch(() => {
				res.sendStatus(500);
			});
	}
});

app.get('/logout', (req, res) => {
	req.session = null;
	res.redirect('/');
});

app.get('*', signedOutRedirect, function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

//socket

let connectedSockets = [];
let chatMessages = [];

io.on('connection', function(socket) {
	if (!socket.request.session || !socket.request.session.userId) {
		return socket.disconnect(true);
	}

	const userId = socket.request.session.userId;

	connectedSockets.push({ socketId: socket.id, userId: userId });

	let onlineUsers = connectedSockets.map((elem) => {
		return elem.userId;
	});
	console.log(onlineUsers);

	db.getUsersByIds(onlineUsers).then((results) => {
		socket.emit('onlineUsers', results);
	});

	const wasAlreadyHere =
		connectedSockets.filter((s) => s.userId == userId).length > 1;

	if (!wasAlreadyHere) {
		db.joinById(userId).then((results) => {
			socket.broadcast.emit('userJoined', results);
		});
	}

	socket.on('disconnect', function() {
		if (!wasAlreadyHere) {
			db.joinById(userId).then((results) => {
				socket.broadcast.emit('userLeft', results);
			});
		}
		delete onlineUsers[socket.id];
	});

	socket.emit('recentMessages', chatMessages);
	// console.log('chatmesssss: ', chatMessages);
	socket.on('chatMessage', function(newMessage) {
		console.log('string: ', newMessage);

		db.getUserById(socket.request.session.userId).then((data) => {
			let completeNewMessage = {
				firstName: data.first_name,
				image: data.image,
				userId: socket.request.session.userId,
				content: newMessage,
				date: new Date().toLocaleString()
			};
			chatMessages = [...chatMessages, completeNewMessage];
			// console.log('newMessage: ', newMessage);
			if (chatMessages.length > 10) {
				chatMessages.shift();
			}
			io.sockets.emit('newMessage', completeNewMessage);
		});
	});
});

server.listen(8080, function() {
	console.log("I'm listening.");
});
