const bcrypt = require('bcryptjs')

module.exports = (req, res, next) => {
  req.cleanedPayload = {
    username: req.body.username.trim(),
    password: bcrypt.hashSync(req.body.password.trim()),
  }
  next()
}
