let jwt = require('jsonwebtoken');
let constants = require('./constants')
module.exports = {
    createToken,
}

function createToken(user) {
    let payload = { // returning parameter 
      subject: user.id,
      username: user.username,
    };
  
    let secret = constants.jwtSecret; // returning parameter 
  
    let options = { // returning parameter 
      //takes milliseconds but you can do '1d' etc
      expiresIn: "1d"
    }
  
    return jwt.sign(payload, secret, options)
  }