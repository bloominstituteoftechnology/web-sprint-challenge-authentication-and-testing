const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../secrets/authSecret');

function Token(username) {
    const payload = {
        subject: username.id,
        username: username.username,
        role: username.role || 'user',
    };
    
    return jwt.sign(payload, jwtSecret);
}

module.exports = Token;