const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets')

module.exports = function (user) {
    const payload = {
      subject: user.id,
      username: user.username,
    }
    const options = {
      expiresIn: '1d',
    }
    return jwt.sign(payload, jwtSecret, options)
  }
