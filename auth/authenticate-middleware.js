const jwt = require('jsonwebtoken')
const secrets = require('../api/secrets')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  const secret = secrets.jwtSecret

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "You're not supposed to be here" })
      } else {
        req.decodedToken = decodedToken;
        next()
      }
    })
  } else {
    res.status(401).json({ you: 'shall not pass!' })
  }
};