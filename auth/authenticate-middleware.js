/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../config/secrets')

module.exports = (req, res, next) => {
  const {authorization} = req.headers
  if (authorization){
    jwt.verify(authorization, jwtSecret, (err, decodedToken) => {
      if (err){
        res.status(401).json({message: "invalid credentials"})
      } else {
        req.decodedToken = decodedToken
        next()
      }
    })
  } else {
    res.status(400).json({message: "No credentials provided."});
  }
};
