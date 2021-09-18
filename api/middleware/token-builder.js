const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../../config')

module.exports = (req, res, next) => {
  const payload = {
    user_id: req.params.user_id,
    username: req.body.username,
    password: req.body.password
  }
  const options = {
    expiresIn: '1d'
  }
  req.token = jwt.sign(payload, JWT_SECRET, options)
  return next()
}
