const { JWT_SECRET } = require("../secrets"); // use this secret!
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  // 2- On missing token in the Authorization header,
  // the response body should include a string exactly as follows: "token required".
  if (!token) return next({ status: 401, message: 'token required' });

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      // 3- On invalid or expired token in the Authorization header,
      // the response body should include a string exactly as follows: "token invalid".
      next({ status: 401, message: 'token invalid' });
    } else {
      // 1- On valid token in the Authorization header, call next.
      req.decodedToken = decodedToken;
      next();
    }
  });
};
