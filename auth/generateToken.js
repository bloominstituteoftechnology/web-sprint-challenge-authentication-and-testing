const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../api/secrets')

module.exports = (user) => {
    const payload = {
        userId: user.id,
        username: user.username,
    }

    const options = {
        expiresIn: '1hr'
    }

    return jwt.sign(payload, jwtSecret, options)
}