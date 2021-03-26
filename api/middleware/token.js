const jwt = require('jsonwebtoken');
const jwtSecret = "TBOSS";

module.exports =  function makeToken(user){

    const payload = {
        id: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: "100000s",
    }
    return jwt.sign( payload, jwtSecret, options);  
    
}
