const { jwtSecret } = require('../database/secrets')
const jwt = require('jsonwebtoken')
/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).json({
      message: 'you are not authorized to view this page'
      })
    }
    jwt.verify(token, jwtSecret, (error, decodedToken) => {
      if(error) {
        res.status(401).json({
          message: 'token does not exist'
        })
      }
      console.log('decoded token ->', decodedToken)
      req.decodedJWT = decodedToken
      next()
    })
}
