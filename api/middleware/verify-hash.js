const bcrypt = require('bcryptjs')

module.exports = (req, res, next) => {
  const {
    password
  } = req.user
  bcrypt.compareSync(req.body.password, password)
  return next()
}
