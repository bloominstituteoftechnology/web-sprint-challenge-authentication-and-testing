const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../../secrets.js')


module.exports = (req, res, next) => {
  if (!req.headers.Authorization) {
    res.status(401).json({ message: 'token required' })
  } else {
    jwt.verify(req.headers.Authorization, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' })
      } else {
        req.user = decoded;
        next();
      }
    })
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
