const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../secrets/authSecret');

function generateToken(username) {
    const payload = {
        subject: username.id,
        username: username.username,
        role: username.role || 'user',
    };

    const options = {
        expiresIn: '1h',
    };
    return jwt.sign(payload, jwtSecret, options);
}

module.exports = generateToken