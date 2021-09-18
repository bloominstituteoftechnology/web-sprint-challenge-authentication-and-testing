const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../../config')

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) return next({
    status: 401,
    message: 'token required'
  })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next({
      status: 401,
      message: 'token invalid'
    })
    if (decoded) {
      return next()
    }
  })
}
