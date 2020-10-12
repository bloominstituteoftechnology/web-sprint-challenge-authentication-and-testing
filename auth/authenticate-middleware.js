/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken")
const { jwtSecret } = require('../config/secret')

module.exports = (req, res, next) => {
  // res.status(401).json({ you: 'shall not pass!' });
  const { authorization } = req.headers//Check headers for Web token
  if (authorization) {
    jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid credentials, AM.js" })
      } else {
        req.decodedToken = decodedToken // If cred valid token
        next()
      }
    })
  } else {
    res.status(400).json({ message: " No credentials provided" })
  }
};
