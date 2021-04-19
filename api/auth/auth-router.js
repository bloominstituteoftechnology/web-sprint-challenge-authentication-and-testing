
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./auth-model');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
	function isValid(user) {
		return Boolean(
			user.username && user.password && typeof user.password === 'string'
		);
	}
	if (isValid(req.body)) {
		try {
			const { username, password } = req.body;
			//gets these items from the request
			const hash = bcrypt.hashSync(password, 10);
			//sets the hash for encrypting the password
			const user = { username, password: hash };
			//sets the user to be the username and a hashed password
			const addedUser = Users.add(user);
			res.json(addedUser);
			//adds the user into the database
		} catch (err) {
			res.status(500).json({ message: 'username taken' });
		}
	} else {
		res.status(400).json({
			message: 'username and password required',
		});
	}
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res, next) => {
	const { username, password } = req.body;
	function isValid(user) {
		return Boolean(
			user.username && user.password && typeof user.password === 'string'
		);
	}
	if (isValid(req.body)) {
		Users.findBy({ username: username })
			.then(([user]) => {
				if (user && bcrypt.compareSync(password, user.password)) {
					const token = makeToken(user); // make token
					res.status(200).json({ message: 'Welcome to our API', token }); // send it back
				} else {
					res.status(401).json({ message: 'Invalid credentials' });
				}
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	} else {
		res.status(400).json({
			message: 'username and password required',
		});
	}
});
/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
const { jwtSecret } = require('./secret.js');
function makeToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		role: user.role,
		foo: 'bar',
	};
	const options = {
		expiresIn: '5 minutes',
	};
	return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;