const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../../config/secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        next({ status: 401, message: 'token invalid'})
      } else {
        req.decodedJwt = decoded
        next()
      }
    })
  } else {
    next({ status: 401, message: 'token required'})
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
