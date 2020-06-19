let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
const { jwtSecret } = require('../utils/constants');

/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {
  let token = req.headers.authorization; // grabs token from request headers property
  let secret = constants.jwtSecret;

  if(token) { 
    jwt.verify(token, secret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.decodedToken = decodedToken; // creates a decoded token inside req
        next();
      }
    })
  } else {
    res.status(401).json({ message: "valid credentials required" });
  }

  // res.status(401).json({ you: 'shall not pass!' });
};
