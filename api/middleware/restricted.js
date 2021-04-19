
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../auth/secret.js');

module.exports = async (req, res, next) => {
	next();
	/*
    IMPLEMENT
    1- On valid token in the Authorization header, call next.
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".
    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: 'token required' });
	}

	jwt.verify(token, jwtSecret, (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(401).json({ message: 'token invalid' });
		}

		console.log(decoded);
		req.decodedJwt = decoded;
		next();
	});
};
