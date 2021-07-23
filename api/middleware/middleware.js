const Users = require('../user/user.model');

function checkUsernameExists(req, res, next) {
	const { username } = req.user;
	Users.findBy({ username })
		.then(user => {
			if (user) {
				req.validUser = user;
				next();
			} else {
				next({ status: 401, message: 'invalid credentials' });
			}
		})
		.catch(next);
		next()
}



function checkUsernameUnique(req, res, next) {
	const { username } = req.user;
	Users.findBy({ username })
		.then(user => {
			if (user) {
				next({ status: 401, message: 'username taken' });
			} else {
				next();
			}
		})
		.catch(next);
	next()
}

async function validateCredentials(req, res, next) {
	let { username, password } = req.body;
	if (
		!username || username.trim() === '' || !password || password.trim() === ''
	) {
		next({ status: 400, message: 'username and password required' });
	} else {
		req.user = {
			username: username.trim(),
			password: password.trim()
		};
		next();
	}
	next()
}

module.exports = {
	checkUsernameExists,
	validateCredentials,
	checkUsernameUnique
};
