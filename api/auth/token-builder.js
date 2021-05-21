const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./secrets');

function tokenBuilder(user) { // { id, username, role }
  const payload = {
    // sub: user.user_id,
    username: user.username,
    
  };
  const options = {
   expiresIn: '1d',
  };
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    options,
  );
  return token;
}

module.exports = tokenBuilder
